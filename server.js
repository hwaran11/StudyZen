const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const groupRoutes = require('./routes/groupRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const userRoutes = require('./routes/userRoutes');
const mindfulnessRoutes = require('./routes/mindfulnessRoutes');
const errorHandler = require('./middleware/errorHandler');
const StudyGroup = require('./models/StudyGroup');
const User = require('./models/User');
const { ObjectId } = require('mongodb');
const { knn } = require('./knn');
const cors = require('cors');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(bodyParser.json());
app.use(helmet());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api', partnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mindfulness', mindfulnessRoutes);

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('fullName username profilePic online shortBio partnerSetup ');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message);
  });

  socket.on('sendFile', (fileData) => {
    io.emit('receiveFile', fileData);
  });

  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('candidate', (candidate) => {
    socket.broadcast.emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.post('/api/recommend', async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!ObjectId.isValid(userId)) {
      console.log('Invalid user ID');
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(new ObjectId(userId));

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const userPreferences = {
      preferred_group_size: user.groupSetup.step1.groupSize,
      preferred_study_schedule: user.groupSetup.step3.studySchedule[0],
      preferred_interaction_style: user.groupSetup.step2.interactionStyle[0],
      preferred_study_session_length: user.groupSetup.step4.sessionLength[0],
      engagement_level: user.groupSetup.step6.engagementLevel[0],
      leadership_style: user.groupSetup.step7.leadershipStyle[0],
      group_support: user.groupSetup.step8.groupSupport[0]
    };

    console.log('User Preferences:', userPreferences);

    const studyGroups = await StudyGroup.find().lean();

    console.log('Fetched Study Groups:', studyGroups);

    const similarities = studyGroups.map((group) => {
      let matchCount = 0;
      if (group.groupSize === userPreferences.preferred_group_size) matchCount++;
      if (group.studySchedule === userPreferences.preferred_study_schedule) matchCount++;
      if (group.interactionStyle === userPreferences.preferred_interaction_style) matchCount++;
      if (group.sessionLength === userPreferences.preferred_study_session_length) matchCount++;
      if (group.engagementLevel === userPreferences.engagement_level) matchCount++;
      if (group.leadershipStyle === userPreferences.leadership_style) matchCount++;
      if (group.groupSupport === userPreferences.group_support) matchCount++;
      return { ...group, matchCount };
    });

    console.log('Similarities:', similarities);

    const matchingGroups = similarities
      .filter(sim => sim.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 3);

    console.log('Matching Groups:', matchingGroups);

    res.json(matchingGroups);
  } catch (err) {
    console.error('Error in recommendation endpoint:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/groups/all', async (req, res) => {
  try {
    const groups = await StudyGroup.find().lean();
    res.json(groups);
  } catch (err) {
    console.error('Error fetching all study groups:', err);
    res.status500().json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Home/home.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Login/login.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Sign Up/signup.html'));
});

app.get('/profile-step1.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 1/profile-step1.html'));
});

app.get('/profile-step2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 2/profile-step2.html'));
});

app.get('/profile-step3.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 3/profile-step3.html'));
});

app.get('/profile-step4.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 4/profile-step4.html'));
});

app.get('/profile-step5.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 5/profile-step5.html'));
});

app.get('/profile-step6.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 6/profile-step6.html'));
});

app.get('/profile-step7.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 7/profile-step7.html'));
});

app.get('/profile-step8.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 8/profile-step8.html'));
});

app.get('/profile-step9.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 9/profile-step9.html'));
});

app.get('/profile-step10.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile-Step 10/profile-step10.html'));
});

app.get('/profile-review.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Profile - Study Partners/profile-review.html'));
});

app.get('/group-setup-step1.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 1/group-setup-step1.html'));
});

app.get('/group-setup-step2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 2/group-setup-step2.html'));
});

app.get('/group-setup-step3.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 3/group-setup-step3.html'));
});

app.get('/group-setup-step4.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 4/group-setup-step4.html'));
});

app.get('/group-setup-step5.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 5/group-setup-step5.html'));
});

app.get('/group-setup-step6.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 6/group-setup-step6.html'));
});

app.get('/group-setup-step7.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 7/group-setup-step7.html'));
});

app.get('/group-setup-step8.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Step 8/group-setup-step8.html'));
});

app.get('/group-setup-review.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group Review/group-setup-review.html'));
});

app.get('/joinstudygroup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Join Study Group/joinstudygroup.html'));
});

app.get('/allstudygroups.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/All Study Groups/allstudygroups.html'));
});

app.get('/findstudypartners.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Find Study Group Partners/findstudypartners.html'));
});

app.get('/createnewstudygroup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Create New Study Group/createnewstudygroup.html'));
});

app.get('/studysession.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Study Group/studysession.html'));
});

app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Dashboard/dashboard.html'));
});

app.get('/daily2r.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Daily Planner 2/daily2.html'));
});

app.get('/calendar-daily.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Calendar-Daily/calendar-daily.html'));
});

app.get('/dailyweekly.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Calendar-Weekly/dailyweekly.html'));
});

app.get('/forgetpassword.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Forget Password/forgetpassword.html'));
});

app.get('/checkyourpassword.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Check Your Password/checkyourpassword.html'));
});

app.get('/resetyourpassword.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Reset Your Password/resetyourpassword.html'));
});

app.get('/passwordchanged.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Password Changed/passwordchanged.html'));
});

app.get('/account.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/Account Creation Successful/account.html'));
});

app.post('/upload', upload.single('profile-pic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ success: true, message: 'File uploaded successfully', file: req.file });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

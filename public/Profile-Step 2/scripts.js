document.addEventListener('DOMContentLoaded', function () {
  const universityContainer = document.getElementById('university');
  const programContainer = document.getElementById('program');
  const semesterContainer = document.getElementById('semester');
  const semesterLabel = document.getElementById('semester-label');
  let currentEvent;

  const data = {
    "Chemical Engineering": {
      "Semester 1": [
        "Penghayatan Etika & Peradaban (Local) / BM Komunikasi 2 (International)",
        "Introduction to Oil & Gas Industry and Sustainable Development",
        "Ethics and Integrity",
        "Engineering Mathematics I",
        "Physical Chemistry"
      ],
      "Semester 2": [
        "Falsafah dan Isu Semasa (Local & International)",
        "Health, Safety & Environment",
        "Engineering Mathematics II",
        "Principles of Chemical Engineering",
        "Chemical Engineering Fluid Mechanics"
      ],
      "Semester 3": [
        "Academic Writing",
        "Scientific Inquiry",
        "Co Curriculum I",
        "Statistics and Application",
        "Process Heat Transfer",
        "Chemical Engineering Thermodynamics I"
      ],
      "Semester 4": [
        "Professional Communication Skills",
        "Separation Process I",
        "Chemical Engineering Thermodynamics II",
        "Chemical Engineering Lab I",
        "Organic Chemistry"
      ],
      "Semester 5": [
        "MPU2 Course",
        "Entrepreneurship",
        "Engineering Team Project I",
        "Data Analytics",
        "Separation Process II",
        "Reaction Engineering I"
      ],
      "Semester 6": [
        "Co Curriculum II",
        "Engineering Team Project II",
        "Process Safety & Loss Prevention",
        "Process Modelling & Simulation",
        "Chemical Engineering Lab II"
      ],
      "Semester 7": [
        "Integrity and Anti-corruption",
        "Environmental Chemical Engineering",
        "Process Plant Design",
        "Analytical Instrumentation",
        "Process Instrumentation & Control"
      ],
      "Semester 8": [
        "Student Industrial Training (SIT)"
      ],
      "Semester 9": [
        "Student Industrial Project (SIP)"
      ],
      "Semester 10": [
        "Project Management",
        "Reaction Engineering II",
        "Material Science for Chemical Engineering",
        "Plant Design Project I",
        "Chemical Engineering Lab III"
      ],
      "Semester 11": [
        "Engineering Economics",
        "Transport Phenomena",
        "Final Year Project I",
        "Plant Design Project II",
        "Core Specialisation I"
      ],
      "Semester 12": [
        "Engineers in Society",
        "Final Year Project II",
        "Core Specialisation II",
        "Core Specialisation III"
      ]
    },
    "Civil Engineering": {
      "Semester 1": [
        "Penghayatan Etika & Peradaban (Local) / BM Komunikasi 2 (International)",
        "Introduction to Oil & Gas Industry and Sustainable Development",
        "Ethics and Integrity",
        "Engineering Mathematics I",
        "Engineering Mechanics",
        "Civil Engineering Drawing"
      ],
      "Semester 2": [
        "Falsafah dan Isu Semasa (Local & International)",
        "Health, Safety & Environment",
        "Engineering Mathematics II",
        "Geomatics",
        "Mechanics of Solids",
        "Co Curriculum I"
      ],
      "Semester 3": [
        "Academic Writing",
        "Statistics and Application",
        "Civil Engineering Fluid Mechanics",
        "Theory of Structures",
        "Traffic Engineering"
      ],
      "Semester 4": [
        "Professional Communication Skills",
        "Sustainable Concrete Technology",
        "Soil Mechanics",
        "Structural Analysis",
        "Hydraulics"
      ],
      "Semester 5": [
        "Data Analytics",
        "Entrepreneurship",
        "Engineering Team Project I",
        "Civil Engineering Laboratory I",
        "Hydrology"
      ],
      "Semester 6": [
        "Engineering Team Project II",
        "Highway Engineering",
        "Design of Steel Structures",
        "Civil Engineering Laboratory III",
        "Water Supply Engineering"
      ],
      "Semester 7": [
        "Integrity and Anti-corruption",
        "Co Curriculum II",
        "Civil Engineering Laboratory III",
        "Design of Reinforced Concrete Structures I",
        "Wastewater Engineering",
        "Design of Foundation"
      ],
      "Semester 8": [
        "Student Industrial Training (SIT)"
      ],
      "Semester 9": [
        "Student Industrial Project (SIP)"
      ],
      "Semester 10": [
        "Construction Project Management",
        "Design of Reinforced Concrete Structures II",
        "Building Information Modelling",
        "Civil Engineering Design I",
        "Design of Earth Retaining Structure"
      ],
      "Semester 11": [
        "Engineering Economics",
        "Civil Engineering Design II",
        "Final Year Project I",
        "Computational Method for Civil Engineers",
        "Core Specialisation I"
      ],
      "Semester 12": [
        "Engineers in Society",
        "Final Year Project II",
        "Core Specialisation II",
        "Core Specialisation III"
      ]
    },
    "Computer Engineering": {
      "Semester 1": [
        "Penghayatan Etika & Peradaban (Local) / BM Komunikasi 2 (International)",
        "Introduction to Oil & Gas Industry and Sustainable Development",
        "Ethics & Integrity",
        "Engineering Mathematics I",
        "Structured Programming and Interfacing",
        "Circuit Theory"
      ],
      "Semester 2": [
        "Falsafah dan Isu Semasa (Local & International)",
        "Health, Safety & Environment",
        "Engineering Mathematics II",
        "Object Oriented Programming",
        "Digital Electronic"
      ],
      "Semester 3": [
        "Academic Writing",
        "Engineering Team Project I",
        "Scientific Inquiry",
        "Software Engineering",
        "Discrete Mathematics",
        "Co Curriculum I"
      ],
      "Semester 4": [
        "Professional Communication Skills",
        "Integrity and Anti-corruption",
        "Signals and Systems",
        "Operating Systems",
        "Algorithm and Data Structure"
      ],
      "Semester 5": [
        "Data Analytics",
        "Engineering Team Project I",
        "Linear Algebra and Matrix Method",
        "Entrepreneurship",
        "Communication Systems"
      ],
      "Semester 6": [
        "Co Curriculum II",
        "Instrumentation and Control",
        "Engineering Team Project II",
        "Microprocessor and Computer Architecture",
        "Digital Twin"
      ],
      "Semester 7": [
        "Embedded and IOT Systems",
        "Digital System Design",
        "Data & Computer Network",
        "Cloud System Technologies"
      ],
      "Semester 8": [
        "Student Industrial Training (SIT)"
      ],
      "Semester 9": [
        "Student Industrial Project (SIP)"
      ],
      "Semester 10": [
        "Project Management",
        "Probability and Random Process",
        "System Integrated Design Project",
        "Core Specialisation I",
        "Computer Security"
      ],
      "Semester 11": [
        "Engineering Economics",
        "Artificial Intelligence & Applications",
        "Final Year Project I",
        "Core Specialisation II"
      ],
      "Semester 12": [
        "Engineers in Society",
        "Final Year Project II",
        "Distributed and Parallel Processing",
        "Core Specialisation III"
      ]
    },
    "Electrical Engineering": {
      "Semester 1": [
        "Penghayatan Etika & Peradaban (Local) / BM Komunikasi 2 (International)",
        "Introduction to Oil & Gas Industry and Sustainable Development",
        "Ethics & Integrity",
        "Engineering Mathematics I",
        "Structured Programming and Interfacing",
        "Circuit Theory"
      ],
      "Semester 2": [
        "Falsafah dan Isu Semasa (Local & International)",
        "Health, Safety & Environment",
        "Engineering Mathematics II",
        "Electrical Circuit Analysis Lab",
        "Signals & Systems",
        "Digital Electronic"
      ],
      "Semester 3": [
        "MPU2 Course",
        "Academic Writing",
        "Scientific Inquiry",
        "Co Curriculum I",
        "Network Analysis",
        "Microelectronic Physics & Devices"
      ],
      "Semester 4": [
        "Integrity and Anti-corruption",
        "Professional Communication Skills",
        "Entrepreneurship",
        "Analogue Electronic",
        "Electromagnetic Theory"
      ],
      "Semester 5": [
        "Data Analytics",
        "Engineering Team Project I",
        "Mixed Signal System Lab",
        "Communication Systems",
        "Microelectronic Circuits"
      ],
      "Semester 6": [
        "Co Curriculum II",
        "Engineering Team Project II",
        "Instrumentation and Measurement",
        "Electrical Machines",
        "Microprocessor & Computer Architecture"
      ],
      "Semester 7": [
        "Power Systems",
        "Control Systems",
        "Power Electronic",
        "Data and Computer Network"
      ],
      "Semester 8": [
        "Student Industrial Training (SIT)"
      ],
      "Semester 9": [
        "Student Industrial Project (SIP)"
      ],
      "Semester 10": [
        "Project Management",
        "Integrated System Design Project I",
        "Digital Signal Processing",
        "Probability and Random Processes",
        "Core Specialisation I"
      ],
      "Semester 11": [
        "Engineering Economics",
        "Final Year Project 1",
        "Integrated System Design Project II",
        "Artificial Intelligence & Applications",
        "Core Specialisation II"
      ],
      "Semester 12": [
        "Engineers in Society",
        "Final Year Project II",
        "Core Specialisation III"
      ]
    },
    "Computer Science": {
      "Semester 1": [
        "Penghayatan Etika dan Peradaban (Local) / BM Komunikasi 2 (International)",
        "Introduction to Oil & Gas Industry and Sustainable Development",
        "Structured Programming",
        "Computer Systems",
        "Engineering Mathematics I"
      ],
      "Semester 2": [
        "Falsafah dan Isu Semasa (Local & International)",
        "Health, Safety & Environment",
        "Object Oriented Programming",
        "Data Communication and Network",
        "Discrete Mathematics"
      ],
      "Semester 3": [
        "MPU2 Course",
        "Academic Writing",
        "Co Curriculum I",
        "Statistics and Empirical Method",
        "Data & Information Management",
        "Algorithm and Data Structure"
      ],
      "Semester 4": [
        "Integrity and Anti-corruption",
        "Scientific Inquiry",
        "Co Curriculum II",
        "Software Engineering & HCI",
        "Artificial Intelligence"
      ],
      "Semester 5": [
        "Community Engagement Project",
        "Professional Communication Skills",
        "Data Science",
        "Minor Elective I"
      ],
      "Semester 6": [
        "Student Industrial Training (SIT)"
      ],
      "Semester 7": [
        "Student Industrial Project (SIP)"
      ],
      "Semester 8": [
        "Entrepreneurship",
        "Technopreneurship Team Project",
        "Modelling and Simulation",
        "Computer Security",
        "Minor Elective II"
      ],
      "Semester 9": [
        "Final Year Project I",
        "Minor Elective III",
        "Minor Elective IV",
        "Core Specialisation I",
        "Core Specialisation II"
      ],
      "Semester 10": [
        "Final Year Project I",
        "Distributed and Parallel Computing",
        "Core Specialisation III",
        "Minor Elective IV"
      ]
    },
    "Information Technology": {
      "Semester 1": [
        "Penghayatan Etika dan Peradaban (Local) / BM Komunikasi 2 (International)",
        "Introduction to Oil & Gas Industry & Sustainable Development",
        "Ethics and Integrity",
        "Structured Programming",
        "Database Systems"
      ],
      "Semester 2": [
        "Falsafah dan Isu Semasa (Local & International)",
        "Health, Safety & Environment",
        "Object Oriented Programming",
        "Computer Systems",
        "Web Application and Integrative Programming"
      ],
      "Semester 3": [
        "Academic Writing",
        "Scientific Inquiry",
        "Co Curriculum I",
        "Data Communication and Network",
        "Software Engineering",
        "Discrete Mathematics"
      ],
      "Semester 4": [
        "MPU2 Course",
        "Co Curriculum II",
        "Professional Communication Skills",
        "Entrepreneurship",
        "Human and Computer Interaction",
        "Information Assurance and Security"
      ],
      "Semester 5": [
        "Data Science",
        "Integrity and Anti-corruption",
        "Statistics and Empirical Method",
        "Internet of Things",
        "Minor Elective I"
      ],
      "Semester 6": [
        "Community Engagement Project",
        "Technopreneurship Team Project",
        "Computer Ethics and Cyber Law",
        "Computer Forensic",
        "Minor Elective II"
      ],
      "Semester 7": [
        "Student Industrial Training (SIT)"
      ],
      "Semester 8": [
        "Student Industrial Project (SIP)"
      ],
      "Semester 9": [
        "Final Year Project I",
        "IT Project Management",
        "Core Specialisation I",
        "Core Specialisation II",
        "Minor Elective III"
      ],
      "Semester 10": [
        "Final Year Project II",
        "Core Specialisation III",
        "Minor Elective IV",
        "Minor Elective V"
      ]
    }
  };

  universityContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('tag')) {
      toggleSingleTag(event.target);
    }
  });

  programContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('tag')) {
      toggleSingleTag(event.target);
      const selectedProgram = event.target.dataset.value;
      populateSemesters(selectedProgram);
      semesterLabel.style.display = 'block';
      semesterContainer.style.display = 'flex';
    }
  });

  semesterContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('tag')) {
      toggleSingleTag(event.target);
      const selectedProgram = programContainer.querySelector('.tag.selected').dataset.value;
      const selectedSemester = event.target.dataset.value;
      populateSubjects(selectedProgram, selectedSemester);
    }
  });

  function populateSemesters(program) {
    semesterContainer.innerHTML = '';
    if (data[program]) {
      Object.keys(data[program]).forEach(semester => {
        const tag = document.createElement('div');
        tag.classList.add('tag');
        tag.textContent = semester;
        tag.dataset.value = semester;
        semesterContainer.appendChild(tag);
      });
    }
  }

  function populateSubjects(program, semester) {
    if (data[program] && data[program][semester]) {
      const subjectList = document.getElementById('subject-list');
      subjectList.innerHTML = '';

      data[program][semester].forEach((subject, index) => {
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('subject-item');
        subjectDiv.textContent = subject;
        subjectDiv.dataset.subject = subject;
        subjectList.appendChild(subjectDiv);
      });
    }
  }

  window.toggleSingleTag = function (tag) {
    const container = tag.parentElement;
    container.querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));
    tag.classList.add('selected');
  }

  document.getElementById('profileForm2').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const university = document.querySelector('#university .tag.selected').dataset.value;
    const program = document.querySelector('#program .tag.selected').dataset.value;
    const semester = document.querySelector('#semester .tag.selected').dataset.value;

    const data = { university, program, semester };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile/step2', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        alert('Profile step 2 saved');
        updateProgress('partners', 40); // Update study partners progress
        window.location.href = '/Profile-Step 3/profile-step3.html'; // Redirect to step 3
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  function updateProgress(type, percentage) {
    if (type === 'partners') {
      document.getElementById('progress-partners').style.width = `${percentage}%`;
    } else if (type === 'groups') {
      document.getElementById('progress-groups').style.width = `${percentage}%`;
    }
  }
});

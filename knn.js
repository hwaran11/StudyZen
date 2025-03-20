const euclideanDistance = (a, b) => {
    return Math.sqrt(a.reduce((sum, _, i) => sum + (a[i] - b[i]) ** 2, 0));
  };
  
  const knn = (userVector, allVectors, k = 3) => {
    const distances = allVectors.map((vector, index) => ({
      index,
      distance: euclideanDistance(userVector, vector),
    }));
    distances.sort((a, b) => a.distance - b.distance);
    return distances.slice(0, k).map(neighbor => neighbor.index);
  };
  
  module.exports = { knn };
  
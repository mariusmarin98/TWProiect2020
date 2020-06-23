module.exports = () => {
  const fs = require("fs");
  var stringExercises = fs.readFileSync("allExercises.json");
  return JSON.parse(stringExercises);
};

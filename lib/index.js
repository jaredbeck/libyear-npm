var calculator = require('./calculator').calculator;
var calculatorEvents = require('./calculator').calculatorEvents;
var outdated = require('./outdated');
var releaseTime = require('./release-time');

function calculate(projectDirectory) {
  const result = calculator(
    outdated(projectDirectory),
    releaseTime,
    process.stdout
  );
  return result;
}

module.exports = { calculate, calculatorEvents };

var calculator = require ('./calculator').calculator;

function calculate(projectDirectory) {
    const result = calculator(outdated(projectDirectory), releaseTime, process.stdout);
    return result;
}

module.exports = calculate;

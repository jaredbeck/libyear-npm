'use strict';

var _ = require('lodash');
var execSync = require('child_process').execSync;
var resolve = require('path').resolve;

// Runs `npm outdated` and either returns a JSON string or exits the process.
function outdated(directory) {
  var cmd = 'npm outdated --json';
  var stdout;
  try {
    // If there are no outdated pacakges, npm will exit with status 0 and
    // `execSync` will not throw.
    var cwd = undefined;
    if (directory) {
      cwd = resolve(directory);
    }
    stdout = execSync(cmd, { timeout: 30000, encoding: 'utf8', cwd });
  } catch(error) {
    // When npm exits with status code 1, it is normal and indicates that some
    // packages are out of date.
    if (error.status === 1 && (_.isNull(error.error) || _.isUndefined(error.error))) {
      stdout = error.stdout;
    } else {
      var e = new Error('Failed to run: ' + cmd + '\n' + error.message);
      e.status = 1;
      throw e;
    }
  }
  // `stdout` can be a `Buffer`, but we just want a string.
  return stdout.toString();
}

module.exports = outdated;

'use strict';

var _ = require('lodash');
var execSync = require('child_process').execSync;
var moment = require('moment');

function releaseTime(packageName, version) {
  var cmd = 'npm view --json ' + packageName;
  var stdout = null;
  try {
    stdout = execSync(cmd);
  } catch(error) {
    var e = new Error('Failed to run: ' + cmd + '\n' + error.message);
    e.status = 1;
    throw e;
  }
  if (stdout === '') {
    var e = new Error('npm view produced no output, no idea why');
    e.status = 1;
    throw e;
  }
  var parsed = JSON.parse(stdout);
  return moment(_.get(parsed, ['time', version]));
}

module.exports = releaseTime;

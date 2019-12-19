'use strict';

var _ = require('lodash');
var moment = require('moment');
var events = require('events');

var eventEmitter = new events.EventEmitter();

function years(currentMoment, latestMoment) {
  var delta = moment(latestMoment).diff(moment(currentMoment), 'years', true);
  return Math.max(delta, 0.0);
}

function assertPackagesAreInstalled(packages) {
  _.forEach(packages, function(value, key) {
    if (_.isUndefined(value['current'])) {
      var e = new Error('Unable to determine current version of package: ' + key + '\n' +
        'Please check that the package is installed\n');
      e.status = 2;
      throw e;
    }
  });
}

// - outdated - JSON string, the stdout from npm outdated.
// - releaseTime - function(packageName, version) returns a `moment`.
//   Dependency injected to aid testing.
function calculator(outdated, releaseTime) {
  // If npm outdated produces no output, great, the total is zero libyears.
  if (outdated === '') {
    return {
      totalLibYears: 0
    };
  }

  var packages = JSON.parse(outdated);
  assertPackagesAreInstalled(packages);

  var sum = 0.0;
  var result = {};
  _.forEach(packages, function(value, key) {
    var currentVersion = value['current'];
    var latestVersion = value['latest'];

    if (_.isUndefined(currentVersion)) {
      var msg = 'Unable to determine current version of package: ' + key +
        '\nPlease check that the package is installed\n';
      throw({ message: msg, status: 2 });
    }

    // Known issue: Each call to `releaseTime` runs `npm view`, which means two
    // network requests that could be combined into one.
    var currentMoment = releaseTime(key, currentVersion);
    var latestMoment = releaseTime(key, latestVersion);

    var yrs = years(currentMoment, latestMoment);
    sum += yrs;
    result[key] = {
      key,
      currentVersion,
      currentMoment,
      latestVersion,
      latestMoment,
      years: yrs
    };

    // Printing each line as soon as we can is nice, actually, since each row
    // takes so long. It lets people know something is happening.
    eventEmitter.emit('repositoryScanned', result[key]);
  });

  result.totalLibYears = sum;
  return result;
}

module.exports = { calculator, eventEmitter };

describe('calculator', function() {
  var calculator = require('../lib/calculator.js').calculator;
  var moment = require('moment');

  it('is a function', function() {
    expect(typeof(calculator)).toEqual('function');
  });

  describe('nothing is outdated', function() {
    it('returns a total of 0.0', function() {
      var outdated = '';
      var releaseTime = function() {
        throw 'test failed: unexpected call'
      };
      var result = calculator(outdated, releaseTime);
      expect(result.totalLibYears).toEqual(0);
    });
  });

  describe('a package is outdated', function() {
    it('prints the expected output', function() {
      var outdated = JSON.stringify(
        {
          'banana': {
            'current': '1.0.0',
            'wanted': '1.0.1',
            'latest': '2.0.0',
            'location': 'node_modules/banana'
          }
        }
      );
      var releaseTime = function(packageName, version) {
        return {
          '1.0.0': moment('2016-02-28'),
          '1.0.1': moment('2016-02-29'),
          '2.0.0': moment('2017-02-28')
        }[version];
      };
      var result = calculator(outdated, releaseTime);
      expect(result).toEqual({
        banana: {
          key: 'banana',
          currentVersion: '1.0.0',
          currentMoment: moment('2016-02-28'),
          latestVersion: '2.0.0',
          latestMoment: moment('2017-02-28'),
          years: 1
        },
        totalLibYears: 1
      });
    });
  });
});

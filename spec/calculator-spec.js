describe('calculator', function() {
  var calculator = require('../lib/calculator.js').calculator;
  var moment = require('moment');
  var eventEmitter = require('../lib/calculator.js').eventEmitter;

  it('is a function', function() {
    expect(typeof(calculator)).toEqual('function');
  });

  describe('nothing is outdated', function() {
    it('returns a total of 0.0', function() {
      var outdated = '';
      var releaseTime = function() {
        throw 'test failed: unexpected call'
      };
      var eventHandler = jasmine.createSpy();
      eventEmitter.on('repositoryScanned', eventHandler);
      var result = calculator(outdated, releaseTime);
      expect(result.totalLibYears).toEqual(0);
      expect(eventHandler.calls.count()).toEqual(0);
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
      var eventHandler = jasmine.createSpy();
      eventEmitter.on('repositoryScanned', eventHandler);
      var result = calculator(outdated, releaseTime);
      var expectedResult = {
        banana: {
          key: 'banana',
          currentVersion: '1.0.0',
          currentMoment: moment('2016-02-28'),
          latestVersion: '2.0.0',
          latestMoment: moment('2017-02-28'),
          years: 1
        },
        totalLibYears: 1
      };
      expect(result).toEqual(expectedResult);
      expect(eventHandler.calls.count()).toEqual(1);
      expect(eventHandler.calls.first().args.length).toEqual(1);
      expect(eventHandler.calls.first().args[0]).toEqual(expectedResult.banana);
    });
  });
});

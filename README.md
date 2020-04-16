# libyear-npm

[![Build Status](https://travis-ci.org/jaredbeck/libyear-npm.svg?branch=master)](https://travis-ci.org/jaredbeck/libyear-npm)

A simple measure of dependency freshness.

https://libyear.com/

## Usage

### Using npx

[npx](https://blog.npmjs.org/post/162869356040/introducing-npx-an-npm-package-runner) is available with npm v5.2.0 and above.

Browse to a folder containing the `package.json` and use:

```
npx libyear-npm
```

### Local usage

At the root of your project, run:

```
npm install libyear-npm --save-dev

./node_modules/libyear-npm/bin/libyear-npm
       history      2.1.2      2016-05-26      4.5.1      2017-01-09     0.6
       numeral      1.5.6      2016-11-24      2.0.4      2016-12-21     0.1
     pluralize      3.1.0      2016-12-12      4.0.0      2017-03-03     0.2
   react-redux      4.4.6      2016-11-14      5.0.3      2017-02-23     0.3
  react-router      2.8.1      2016-09-13      3.0.2      2017-01-18     0.3
          rest      1.3.2      2016-03-23      2.0.0      2016-06-16     0.2
     validator      6.3.0      2017-02-24      7.0.0      2017-02-24     0.0
System is 1.8 libyears behind
```

### Programmatic usage

It is possible to use libyear-npm from your applications.

#### calculate

```js
var calculate = require('libyear-npm').calculate;

/*
  Provide the path to a folder containing a package.json file
  Path can be absolute or relative
*/
var result = calculate('./path/to/my/project/root');
console.log('Total libyears: ' + result.totalLibYears);

/* Result is an object with the following structure:
  {
    totalLibYears: 1.6,
    library1: {
      key: string,
      currentVersion: string,
      currentMoment: moment,
      latestVersion: string,
      latestMoment: moment,
      years: number
    },
    library2: { ... },
    ...
  }
*/
```

#### calculatorEvents

You can also subcribe to the `calculatorEvents` to get results as they are processed:

```js
var calculate = require('libyear-npm').calculate;
var calculatorEvents = require('libyear-npm').calculatorEvents;

calculatorEvents.on('libScanned', libStats => {
  /* libStats is an object with the following structure:
    {
      key: string,
      currentVersion: string,
      currentMoment: moment,
      latestVersion: string,
      latestMoment: moment
      years: number
    }
  */
  console.log('Lib: ' + libStats.key + ', years: ' + libStats.years);
});

var result = calculate('./path/to/my/project/root');
console.log('Total libyears: ' + result.totalLibYears);
```

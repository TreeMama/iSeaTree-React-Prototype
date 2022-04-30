# Schedule

A tiny cron-like tools for humman, implement by Node.js

[![Build Status](https://travis-ci.org/popomore/schedule.png?branch=master)](https://travis-ci.org/popomore/schedule)
[![Coverage Status](https://coveralls.io/repos/popomore/schedule/badge.png)](https://coveralls.io/r/popomore/schedule)

---

## Install

```
$ npm install schedule
```

## Usage

```
var every = require('schedule').every;
every('2s').do(function() {
  // do your job
});
```

You can stop interval when some exception

```
var every = require('schedule').every;
var ins = every('2 seconds').do(cb);

process.on('uncaughtException', function() {
  ins.stop();
})
```

## Format

- ms, millisecond, milliseconds
- s, second, seconds
- m, minite, minites
- h, hour, hours
- d, day, days

## Lisence

MIT

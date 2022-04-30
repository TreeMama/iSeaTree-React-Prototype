
exports.every = function(str) {
  return new Every(str);
};

/*
  Time map
*/

var time = {
  millisecond: 1,
  second: 1000,
  minute: 60000,
  hour: 3600000,
  day: 86400000
};

for (var key in time) {
  if (key === 'millisecond') {
    time.ms = time[key];
  } else {
    time[key.charAt(0)] = time[key];
  }
  time[key + 's'] = time[key];
}


/*
  Every constructor
*/

function Every(str) {
  this.count = 0;
  var m = parse(str);
  if (m) {
    this.time = Number(m[0]) * time[m[1]];
    this.type = m[1];
  }
}

Every.prototype.do = function(cb) {
  if (this.time) {
    this.interval = setInterval(callback, this.time);
  }

  var that = this;
  function callback() {
    that.count++;
    cb.call(that);
  }
  return this;
};

Every.prototype.stop = function() {
  if (this.interval) {
    clearInterval(this.interval);
    delete this.interval;
  }
  return this;
};


/*
  Convert string to milliseconds

    ms, millisecond(s)?
    s, second(s)?
    m, minute(s)?
    h, hour(s)?
    d, day(s)?
*/
var reg = /^\s*(\d+(?:\.\d+)?)\s*([a-z]+)\s*$/;

function parse(str) {
  var m = str.match(reg);
  if (m && time[m[2]]) {
    return m.slice(1);
  }
  return null;
}

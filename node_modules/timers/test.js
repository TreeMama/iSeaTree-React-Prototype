var every = require('./index').every;
var should = require('should');
var sinon = require('sinon');

describe('Timers', function() {
  it('string parse', function() {
    every('10ms').time.should.be.eql(10);
    every('2s').time.should.be.eql(2000);
    every('2.5m').time.should.be.eql(150000);
    every('2h').time.should.be.eql(7200000);
    every('2d').time.should.be.eql(172800000);
  });

  it('string parse format', function() {
    every('2hour').time.should.be.eql(7200000);
    every('2 hour').time.should.be.eql(7200000);
    every('2 hours').time.should.be.eql(7200000);

    every(' 2  day ').time.should.be.eql(172800000);
    every('2days ').time.should.be.eql(172800000);

    should.not.exist(every(' 2 unknown').time);
  });

  it('every', function(done) {
    var spy = sinon.spy();
    var e = every('50ms').do(spy);
    setTimeout(function() {
      spy.calledOn(e);
      spy.callCount.should.be.eql(1);
    }, 55);
    setTimeout(function() {
      spy.callCount.should.be.eql(2);
    }, 105);
    setTimeout(function() {
      spy.callCount.should.be.eql(3);
      done();
    }, 155);
  });


  it('every stop', function(done) {
    var spy = sinon.spy();
    var e = every('50ms').do(spy);
    setTimeout(function() {
      spy.calledOn(e);
      spy.callCount.should.be.eql(1);
      e.stop();
    }, 55);
    setTimeout(function() {
      spy.callCount.should.be.eql(1);
      done();
    }, 105);
  });
});

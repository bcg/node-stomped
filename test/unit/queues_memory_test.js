require(__dirname + '/test_helper');

var testCase = require('nodeunit').testCase,
    stomp    = require('stomped');

module.exports = testCase({
    setUp: function (c) {
      c();
    },
    tearDown: function (c) {
      c();
    },
    register: function (t) {
      var mq = new stomp.MemoryQueues();
      t.equal(mq.register('test'), true);
      t.done();
    },
    push: function (t) {
      var mq = new stomp.MemoryQueues();
      t.equal(mq.push('test', 'message'), true);
      t.done();
    }
});


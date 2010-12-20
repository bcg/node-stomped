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
    testIt: function (t) {
      t.equal(true, true);
      t.done();
    }
});


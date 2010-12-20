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
    add: function (t) {
      var client = new stomp.Client();
      var subs = new stomp.Subscriptions();
      t.equal(subs.add('test', client), true);
      t.done();
    },
    remove: function(t) {
      var client = new stomp.Client();
      var subs = new stomp.Subscriptions();            
      t.equal(subs.remove('test', client), false);
      t.equal(subs.add('test', client), true);
      t.equal(subs.remove('test', client), true);
      t.done();        
    },
    findClients: function(t) {
      var client1 = new stomp.Client();
      client1.ip = '127.0.0.1';
      var client2 = new stomp.Client();
      client2.ip = '10.0.0.1';
      var subs = new stomp.Subscriptions();            
      t.equal(subs.add('test', client1), true);
      t.equal(subs.add('test', client2), true);
      t.deepEqual(subs.findClients('test'),[client1, client2]);
      t.equal(subs.remove('test', client1), true);
      t.deepEqual(subs.findClients('test'),[client2]);
      t.equal(subs.remove('test', client2), true);
      t.deepEqual(subs.findClients('test'),[]);
      t.done();        
    },

});


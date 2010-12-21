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
    subscribe: function (t) {
      var client = new stomp.Client();
      var channel = new stomp.Channel();
      t.equal(channel.subscribe('test', client), true);
      t.done();
    },
    unsubscribe: function(t) {
      var client = new stomp.Client();
      var channel = new stomp.Channel();            
      t.equal(channel.unsubscribe('test', client), false);
      t.equal(channel.subscribe('test', client), true);
      t.equal(channel.unsubscribe('test', client), true);
      t.done();        
    },
    findClients: function(t) {
      var client1 = new stomp.Client();
      client1.ip = '127.0.0.1';
      var client2 = new stomp.Client();
      client2.ip = '10.0.0.1';
      var channel = new stomp.Channel();            
      t.equal(channel.subscribe('test', client1), true);
      t.equal(channel.subscribe('test', client2), true);
      t.deepEqual(channel.findClients('test'),[client1, client2]);
      t.equal(channel.unsubscribe('test', client1), true);
      t.deepEqual(channel.findClients('test'),[client2]);
      t.equal(channel.unsubscribe('test', client2), true);
      t.deepEqual(channel.findClients('test'),[]);
      t.done();        
    },

});


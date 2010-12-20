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

    'client -> CONNECT': function (t) {
      var parser = new stomp.Parser();
      var s = 'CONNECT\nlogin:user\npassword:pass\n\n\x00';
      parser.on('CONNECT', function(headers, body) {
        t.equal(body, '');
        t.equal(headers['login'], 'user');
        t.equal(headers['password'], 'pass');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> SEND': function (t) {
      var parser = new stomp.Parser();
      var s = 'SEND\ndestination:/this/queue\n\nmessage body\x00';
      parser.on('SEND', function(headers, body) {
        t.equal(body, 'message body');
        t.equal(headers['destination'], '/this/queue');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> SUBSCRIBE': function (t) {
      var parser = new stomp.Parser();
      var s = 'SUBSCRIBE\ndestination:/this/queue\nack:client\n\n\x00';
      parser.on('SUBSCRIBE', function(headers, body) {
        t.equal(headers['destination'], '/this/queue');
        t.equal(headers['ack'], 'client');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> UNSUBSCRIBE': function (t) {
      var parser = new stomp.Parser();
      var s = 'UNSUBSCRIBE\ndestination:/this/queue\n\n\x00';
      parser.on('UNSUBSCRIBE', function(headers, body) {
        t.equal(headers['destination'], '/this/queue');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> BEGIN': function (t) {
      var parser = new stomp.Parser();
      var s = 'BEGIN\ntransaction:12345\n\n\x00';
      parser.on('BEGIN', function(headers, body) {
        t.equal(headers['transaction'], '12345'); // Required
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> COMMIT': function (t) {
      var parser = new stomp.Parser();
      var s = 'COMMIT\ntransaction:12345\n\n\x00';
      parser.on('COMMIT', function(headers, body) {
        t.equal(headers['transaction'], '12345'); // Required
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> ACK': function (t) {
      var parser = new stomp.Parser();
      var s = 'ACK\nmessage-id:54321\ntransaction:12345\n\n\x00';
      parser.on('ACK', function(headers, body) {
        t.equal(headers['message-id'], '54321'); // Required
        t.equal(headers['transaction'], '12345');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> ABORT': function (t) {
      var parser = new stomp.Parser();
      var s = 'ABORT\ntransaction:12345\n\n\x00';
      parser.on('ABORT', function(headers, body) {
        t.equal(headers['transaction'], '12345'); // Required
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'client -> DISCONNECT': function (t) {
      var parser = new stomp.Parser();
      var s = 'DISCONNECT\n\n\x00';
      parser.on('DISCONNECT', function(headers, body) {
        t.equal(body, ''); // Required
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },

    // SERVER PROTOCOL

    'server -> CONNECTED': function (t) {
      var parser = new stomp.Parser();
      var s = 'CONNECTED\nsession:12345\n\n\x00';
      parser.on('CONNECTED', function(headers, body) {
        t.equal(body, '');
        t.equal(headers['session'], '12345');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'server -> MESSAGE': function (t) {
      var parser = new stomp.Parser();
      var s = 'MESSAGE\ndestination:/this/queue\nmessage-id:12345\n\nmy message\x00';
      parser.on('MESSAGE', function(headers, body) {
        t.equal(body, 'my message');
        t.equal(headers['message-id'], '12345');
        t.equal(headers['destination'], '/this/queue');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'server -> RECEIPT': function (t) {
      var parser = new stomp.Parser();
      var s = 'RECEIPT\nreceipt-id:12345\n\n\x00';
      parser.on('RECEIPT', function(headers, body) {
        t.equal(body, '');
        t.equal(headers['receipt-id'], '12345');
        t.done();
      });
      t.equal(parser.appendString(s), true);
    },
    'server -> ERROR': function (t) {
      var parser = new stomp.Parser();
      var s = 'ERROR\nmessage:short error message\n\nlonger error message\x00';
      parser.on('ERROR', function(headers, body) {
        t.equal(body, 'longer error message');
        t.equal(headers['message'], 'short error message'); // Required
        t.done();
      });
      t.equal(parser.appendString(s), true);
    }
});


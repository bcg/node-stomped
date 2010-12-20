// Broker

var net     = require('net'),
    sys     = require('sys'),
    util    = require('util'),
    events  = require('events');


function Client(proto) {
  this.ip = '';
  this.port = '';
  this.login= '';
  this.password = '';
  this.session_id = '';
  this.proto = proto;
};

exports.Client = Client;


function Broker () {
  events.EventEmitter.call(this);

  var stream = arguments[0];
  var func = arguments[1];
  var parser = new Parser();
  var proto = new Protocol(stream);
  var client = new Client(proto);

  stream.setEncoding('ascii');

  stream.on('connect', function(data) {
  });

  stream.on('data', function(data) {
    parser.appendString(data);
  });

  parser.on('CONNECT', function(headers, body) {
    client.session_id = "12345";
    stream.write('CONNECTED\nsession: 12345\n\n\x00'); // XXX unique session id
  });

  parser.on('SEND', function(headers, body) {
    proto.receipt(headers['receipt']);
    proto.emit('send', headers['destination'], body);
  });

  parser.on('SUBSCRIBE', function(headers, body) {
    proto.receipt(headers['receipt']);
    proto.emit('subscribe', client, headers['destination']);
  });

  parser.on('UNSUBSCRIBE', function(headers, body) {
    proto.emit('unsubscribe', headers['destination']);
  });

  process.nextTick(function () {
    proto.emit('free')
  });
  

  func.call(this, proto);
};
util.inherits(Broker, events.EventEmitter);
exports.Broker = Broker;

exports.createBroker = function() {
  return new Broker(arguments[0], arguments[1]);
};


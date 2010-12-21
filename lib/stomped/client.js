
var net     = require('net'),
    sys     = require('sys'),
    util    = require('util'),
    events  = require('events');

function Client() {
  var ip = arguments[0];
  var port = arguments[1];
  var login = arguments[2];
  var password = arguments[3];
  var func = arguments[4];

  var stream = net.createConnection(port, ip);
  var parser = new Parser();
  var proto = new Protocol(stream);

  stream.setEncoding('ascii');

  stream.on('connect', function(){
    proto.connect(login, password);
  });

  stream.on('data', function(data){
    parser.appendString(data);
  });

  stream.on('error', function(error){
  });

  stream.on('end', function(){
  });

  parser.on('CONNECTED', function(headers, body) {
    proto.emit('connected');
  });

  parser.on('MESSAGE', function(headers, body) {
    proto.receipt(headers['receipt']);
    proto.emit('message', headers['destination'], body);
  });
  
  if (func != undefined) {
    func.call(this, proto);
  }
  return proto;
}
util.inherits(Client, events.EventEmitter);

exports.createClient = function() {
  return new Client(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
};

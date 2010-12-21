// Protocol

var sys = require('sys'),
    events = require('events');

Protocol = function(stream) {
  events.EventEmitter(this);
  this.stream = stream;
}
sys.inherits(Protocol, events.EventEmitter);

Protocol.prototype.connect = function(login, password) {
  if (login && password) {
    this.stream.write('CONNECT\nlogin:'+login+'\npassword:'+password+'\n\n\x00');
  } else {
    this.stream.write('CONNECT\n\n\x00');
  }
}

Protocol.prototype.send = function(queue, message) {
  this.stream.write('SEND\ndestination:'+queue+'\n\n'+message+'\x00');
}

Protocol.prototype.receipt = function(id) {
  /* XXX Getting errors when the client closes and I can't send receipt
  if (id && this.stream.writable) 
    this.stream.write('RECEIPT\nreceipt-id:'+id+'\n\n\x00');
  */
}

Protocol.prototype.message = function(queue, message) {
  var id = '1234' // XXX Need unique IDs
  if (queue && message && this.stream.writable) 
    this.stream.write('MESSAGE\ndestination:'+queue+'\nmessage-id:'+id+'\n\n\x00');
}

exports.Protocol = Protocol;

// Parser

var events = require('events'),
    sys = require('sys');

function trim (str) {
	var	str = str.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = str.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

Parser = function() {
  events.EventEmitter(this);

  this.buffer = '';

  this.on('frame', function (data) {
    //console.log("\n\nFRAME\n" + data + "\n\n\n");
    var parts = data.split('\n', -1);
    var command = parts.splice(0, 1);
    var body = parts.splice(-1, 1);
    var headers = new Array();
    for (var i = 0; i < parts.length; i++) {
      var kv = parts[i].split(':', 2);
      if (kv.length == 2) 
        headers[trim(kv[0])] = trim(kv[1]);
    }
    //console.log(headers);
    this.emit(command, headers, body);
  });
};

sys.inherits(Parser, events.EventEmitter);

Parser.prototype.appendString = function (str) {
  this.buffer += str;
  this.parse();
  return true;
};

Parser.prototype.parse = function () {
  var end = this.buffer.indexOf("\x00");

  if (end != -1) {
    var consume = this.buffer.substr(0, end),
        rest    = this.buffer.substr(end + 1, (this.buffer.length - consume.length));
  
    this.buffer = rest;
    this.emit('frame', consume);
    this.parse();
  }
};
exports.Parser = Parser;


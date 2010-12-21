// MemoryQueues

var sys     = require('sys'),
    events  = require('events');

function MemoryQueues(channel) {
  this.queues = [];
  this.channel = channel;
  this.scheduler();
}
sys.inherits(MemoryQueues, events.EventEmitter);

MemoryQueues.prototype.scheduler = function() {
  var self = this;
  setInterval(function() {
    for (k in self.queues) {
      //console.log("q: " + k + " len: "+ self.queues[k].length );
      if (self.queues[k].length >= 1) {
        var m = self.queues[k].pop();
        // XXX Not sure if this is a good idea ...
        if (self.channel != undefined) {
          self.channel.emit(k, k, m);
          self.channel.emit('all', k, m);
        }
      }
    }
  }, 5);
}

MemoryQueues.prototype.register = function(queue) {
  if (!this.queues[queue])
    this.queues[queue] = [];
  return true;
}
MemoryQueues.prototype.push = function(queue, message) {
  this.register(queue);
  this.queues[queue].push(message);
  return true;
}
exports.MemoryQueues = MemoryQueues;


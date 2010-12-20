// MemoryQueues

var sys     = require('sys'),
    events  = require('events');

function MemoryQueues() {
  this.queues = [];
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
        // XXX Need to make this configureable
        self.emit('popable', k, m);
        //self.emit('pop-'+k, m);
      }
    }
  }, 500);
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


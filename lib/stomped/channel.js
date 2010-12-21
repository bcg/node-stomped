// Channel

var sys     = require('sys'),
    events  = require('events'),
    mq      = require('stomped/queues/memory');

function Channel(queueClass) {
  if (queueClass) {
    this.queue = new queueClass(this);
  } else {
    this.queue = new mq.MemoryQueues(this);
  }
  this.list = new Object;
};
sys.inherits(Channel, events.EventEmitter);


Channel.prototype.subscribe = function(queue, client) {
  if (!this.list[queue]) 
    this.list[queue] = [];
  if (client)
    this.list[queue].push(client);
  return true;
};

Channel.prototype.unsubscribe = function(queue, client) {
  if (!this.list[queue]) 
    return false;
  if (client) {
    for(var i=0; i<this.list[queue].length; i++) {
      if (this.list[queue][i].toString() == client.toString()) {
        this.list[queue].splice(i, 1);
        return true;
      }
    }
  }
  return false;
};

Channel.prototype.findClients = function(queue) {
  if (!queue)
    return [];
  if (this.list[queue])
    return this.list[queue];
  return []; 
}

Channel.prototype.push = function(queue, message) {
  this.queue.push(queue, message);
  return true;
}

exports.Channel = Channel;

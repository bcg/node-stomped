// Subscriptions

function Subscriptions() {
  this.list = new Object;
};

Subscriptions.prototype.add = function(queue, client) {
  if (!this.list[queue]) 
    this.list[queue] = [];
  if (client)
    this.list[queue].push(client);
  return true;
};

Subscriptions.prototype.remove = function(queue, client) {
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

Subscriptions.prototype.findClients = function(queue) {
  if (!queue)
    return [];
  if (this.list[queue])
    return this.list[queue];
  return []; 
}

exports.Subscriptions = Subscriptions;

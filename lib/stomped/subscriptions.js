// Subscriptions

function Subscriptions() {
  this.list = [];
};

Subscriptions.prototype.add = function(queue, client) {
  if (!this.list[queue]) 
    this.list[queue] = [];
  if (client)
    this.list[queue].push(client);
};

Subscriptions.prototype.find_clients_by_queue = function(queue) {
  if (!queue)
    return [];
  if (this.list[queue])
    return this.list[queue];
  return []; 
}
exports.Subscriptions = Subscriptions;

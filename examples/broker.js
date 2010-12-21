#!/usr/bin/env node

var net = require('net');
var util = require('util');
var stomp = require('../lib/stomped');

var subscriptions = new stomp.Subscriptions();
var mqueues = new stomp.MemoryQueues();

net.createServer(function (stream) {

  stomp.createBroker(stream, function(proto) {

    proto.on('subscribe', function(client, queue) {
      mqueues.register(queue);
      subscriptions.add(queue, client);

      // If you wanted all queues to route to *every* client you
      // would do it here (not functional)
      mqueues.on('pop-'+queue, function() {
        console.log("locally handled pop-"+queue);
      });
      
    });

    proto.on('unsubscribe', function(client, queue) {
      subscriptions.remove(client, queue);
    });

    proto.on('send', function(queue, message) {
      console.log('recv: '+queue+' : '+message);
      mqueues.push(queue, message);
    }); 

  });

  // If you wanted to control which clients could get messages
  // (round robin, etc).
  mqueues.on('popable', function(queue, message) {
    clients = subscriptions.findClients(queue);
    if (clients.length >= 1) {
      for (var i=0; i<clients.length; i++) {
        clients[i].proto.message(queue, message);
      }
    }

  });

}).listen(61613, '127.0.0.1');


#!/usr/bin/env node

var net = require('net'),
    util = require('util'),
    stomp = require('../lib/stomped');

var channel = new stomp.Channel(stomp.MemoryQueues);

net.createServer(function (stream) {

  stomp.createBroker(stream, function(proto) {

    
    proto.on('subscribe', function(client, queue) {
      channel.subscribe(queue, client);

      // Think I want to wrap this in the Channel.subscribe
      (function(c) {
        var f = function(q, message) {
          console.log(channel.listeners(q));
          console.log("locally handled " + q + " : " + message);
          c.proto.message(q, "local " + message);
        };
        channel.on(queue, f);

        proto.on('unsubscribe', function(client, unsubqueue) {
          if (queue == unsubqueue) {
            channel.unsubscribe(client, unsubqueue);
            channel.removeListener(queue, f);
          }
        });

        proto.on('disconnect', function(client) {
          channel.unsubscribe(client, queue);
          channel.removeListener(queue, f);
        });

      })(client);
      
    });


    proto.on('send', function(queue, message) {
      console.log('recv: '+queue+' : '+message);
      channel.push(queue, message);
    }); 

  });;

}).listen(61613, '127.0.0.1');

// If you wanted to control which clients could get messages
// (round robin, etc).
channel.on('all', function(queue, message) {
  console.log('all handled ' + queue + ' : ' + message);
  clients = channel.findClients(queue);
  if (clients.length >= 1) {
    for (var i=0; i<clients.length; i++) {
      clients[i].proto.message(queue, "all "+message);
    }
  }

});

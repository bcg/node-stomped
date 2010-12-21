#!/usr/bin/env node

var net = require('net'),
    util = require('util'),
    stomp = require('../lib/stomped');

client = stomp.createClient('127.0.0.1', 61613);

client.on('connected', function() {
  console.log('connected');
  client.subscribe('q');
  client.on('message', function(queue, message) {
    console.log('received '+queue+' : '+message);
  });
});



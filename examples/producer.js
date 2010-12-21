#!/usr/bin/env node

var net = require('net'),
    util = require('util'),
    stomp = require('../lib/stomped');

client = stomp.createClient('127.0.0.1', 61613);

client.on('connected', function() {
  for (var i=0; i<100; i++)
    client.send('q', 'message');
});



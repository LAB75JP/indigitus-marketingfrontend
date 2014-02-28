'use strict';

var express = require('express');
var socketio = require('socket.io');
var Instance = require('./lib/controllers/Instance');
/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./lib/config/config');

var app = express();

// Express settings
require('./lib/config/express')(app);

// Routing
require('./lib/routes')(app);

// Start server
var server = app.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

var io = socketio.listen(server);

var instance = new Instance(io);

// Expose app
exports = module.exports = app;
'use strict';



/*
 * MAIN SERVER (HTTP)
 */

var httpserver = null;

(function(global) {

	var express = require('express');

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
	httpserver = app.listen(config.port, function () {
		console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
	});

})(this);



/*
 * WEBSOCKET SERVER
 */

var wsserver = null;

(function(global) {

	var socketio   = require('socket.io');
	var sshtunnel  = require('./server/sshtunnel.js');


	wsserver = socketio.listen(httpserver);

	wsserver.sockets.on('connection', function(socket) {

		socket.on('ping', function(data) {

			var target = data.target;

			sshtunnel.connect(data, function() {
				this.ping(socket, data.target);
			}, sshtunnel);

		});

/*
		socket.on('traceroute', function(data) {
			traceroute.call(socket, data);
		});

		socket.on('upload', function(data) {
			upload.call(socket, data);
		});

		socket.on('download', function(data) {
			download.call(socket, data);
		});
*/

	});

})(this);


exports = module.exports = httpserver;


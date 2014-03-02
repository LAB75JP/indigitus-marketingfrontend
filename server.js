'use strict';
var _fs = require('fs');

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
	var ping       = require('./server/ping.js');
	var download   = require('./server/download.js');
	var traceroute = require('./server/traceroute.js');
  var startInstance = require('./server/start_instance.js');

	var instanceIp = "127.0.0.1";
	// var instanceIp = "54.72.38.49";
	var _config    = JSON.parse(_fs.readFileSync('./lib/config/ssh/' + instanceIp + '.json'));


	wsserver = socketio.listen(httpserver);

	wsserver.sockets.on('connection', function(socket) {

		socket.on('ping', function(data) {

			data.host     = _config.host;
			data.port     = _config.port;
			data.username = _config.username;
			data.password = _config.password;
			ping(data, socket);

		});
    
    socket.on('instance.start', function(data){
      console.log('START_INSTANCE');    
      startInstance(data, socket);
    });

		socket.on('download', function(data) {

			data.host     = _config.host;
			data.port     = _config.port;
			data.username = _config.username;
			data.password = _config.password;


			download(data, socket);

		});

		socket.on('traceroute', function(data) {

			data.host     = _config.host;
			data.port     = _config.port;
			data.username = _config.username;
			data.password = _config.password;


			traceroute(data, socket);

		});

	});

})(this);


exports = module.exports = httpserver;




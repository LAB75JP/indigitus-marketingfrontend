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
	var http = require('http');
	var server = http.createServer(app);
	httpserver = server.listen(config.port, function () {
		console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
	});

	require('./server/index.js')(server);

})(this);

exports = module.exports = httpserver;




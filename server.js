'use strict';

var _express = require('express');
var _fs      = require('fs');


/*
 * MAIN SERVER (HTTP)
 */

var httpserver = null;

(function(global) {

	var config = JSON.parse(_fs.readFileSync('./lib/config/env.json'));

	global.CONFIG      = config[process.env.NODE_ENV || 'development'];
	global.CONFIG.root = path.normalize('./');
	global.CONFIG.port = process.env.PORT || 3000;



	var app = _express();

	// Express settings
	require('./lib/express')(app);

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




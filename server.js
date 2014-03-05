'use strict';

var _CONFIG  = require('./lib/config/config');
var _express = require('express');
var _fs      = require('fs');


/*
 * MAIN SERVER (HTTP)
 */

var httpserver = null;

(function(global) {

	var app = _express();

	app.set('config', _CONFIG);

	require('./lib/config/express')(app);
	require('./lib/routes')(app);


	// Start server
	var http = require('http');
	var server = http.createServer(app);
	httpserver = server.listen(_CONFIG.port, function () {
		console.log('Express server listening on port %d in %s mode', _CONFIG.port, app.get('env'));
	});

	require('./server/index.js')(server);

})(this);

exports = module.exports = httpserver;




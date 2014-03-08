'use strict';

var _CONFIG  = require('./lib/config/config');
var _express = require('express');
var _fs      = require('fs');


/*
 * MAIN SERVER (HTTP)
 */

var httpServer = null;
var httpsServer = null;

(function(global) {

	var app = _express();

	app.set('config', _CONFIG);

	require('./lib/config/express')(app);
	require('./lib/routes')(app);

	// Start server
	var privateKey  = _fs.readFileSync('lib/config/cert/private.pem', 'utf8');
	var certificate = _fs.readFileSync('lib/config/cert/mycert.crt', 'utf8');
	
	var credentials = {
		key: privateKey,
		cert: certificate
	};
	
	var http = require('http');
	var https = require('https');
	var server = http.createServer(app);
	var secureServer = https.createServer(credentials, app);
	
	httpServer = server.listen(_CONFIG.port, function () {
		console.log('Express server listening on port %d in %s mode', _CONFIG.port, app.get('env'));
	});
	
	httpsServer = secureServer.listen(_CONFIG.securePort, function(){
		console.log('Express htts server listening on port %d in %s mode', _CONFIG.securePort, app.get('env'));
	});
	
	require('./server/index.js')(server);
	require('./server/index.js')(secureServer);
	
})(this);

exports = module.exports = httpServer;




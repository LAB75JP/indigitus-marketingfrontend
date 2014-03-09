'use strict';

var _CONFIG  = require('./lib/config/config');
var _express = require('express');
var _http    = require('http');
var _https   = require('https');
var _fs      = require('fs');


/*
 * MAIN SERVER (HTTP)
 */

var http_server  = null;
var https_server = null;

(function(global) {

	var app = _express();

	app.set('config', _CONFIG);

	require('./lib/config/express')(app);
	require('./lib/routes')(app);


	var http_server  = _http.createServer(app);

	http_server.listen(_CONFIG.port, function () {
		console.log('Express server listening on port %d in %s mode', _CONFIG.port, app.get('env'));
	});


	var https_server = _https.createServer({
		key: _fs.readFileSync('lib/config/cert/private.pem', 'utf8'),
		cert: _fs_readFileSync('lib/config/cert/mycert.crt', 'utf8')
	}, app);

	https_server.listen(_CONFIG.securePort, function(){
		console.log('Express htts server listening on port %d in %s mode', _CONFIG.securePort, app.get('env'));
	});


	require('./server/index.js')(http_server);
	require('./server/index.js')(https_server);

})(this);

exports = module.exports = {
	http:  http_server,
	https: https_server
};


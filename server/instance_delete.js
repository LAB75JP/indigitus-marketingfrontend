var _Nova = require('openclient').Nova;
var _CONFIG = require('../lib/config/config');
var async = require('async');

(function(global) {

	var _server = null;
	var _client = new _Nova({
		url: _CONFIG.nova,
		debug: true,
		enforce_https: false
	});



	/*
	 * CHAINED REST API CALLS
	 */

	var _deleteServer = function(id, success, error, scope) {

		_client.servers.del({
			endpoint_type: 'publicURL',
			id: id,
			success: function() {
				success.call(scope);
			},
			error: function(err) {
				error.call(scope, err);
			}
		});

	};

	var _authenticate = function(success, error, scope) {

		_client.authenticate({
			username: _CONFIG.username,
			password: _CONFIG.password,
			project: _CONFIG.project,
			success: function(tokens) {
				success.call(scope, tokens);
			},
			error: function(err) {
				error.call(scope, err);
			}
		});

	};

	var _identifyServer = function(ip, success, error, scope) {
		_client.servers.all({
			endpoint_type: 'publicURL',
			success: function(servers) {
				for (var i = 0; i < servers.length; i++) {
					if (servers[i].addresses) {
						var publicIp = null;
						var ips = null;
						console.log('SERVER ADDRESSES', servers[i].addresses);
						for (var network in servers[i].addresses) {
							console.log('NETWORK', network);
							ips = servers[i].addresses[network];
							for (var y = 0; y < ips.length; y++) {
								publicIp = ips[y].addr;
								if (publicIp === ip) {
									success.call(scope, servers[i]);
									break;
								}
							}
							console.log('PUBLIC IP', publicIp);

						}
					}
				};
			},
			error: function(err) {
				error.call(scope, 'Could not get server');
			}
		});
	}

	var Callback = function(data, socket) {
		_authenticate(function(tokens) {
			_identifyServer(data.host, function(server) {
				console.log('IDENTIFIED SERVER');
				console.log('SERVER', server);
				_deleteServer(server.id, function() {
					socket.emit('instance.deleted');
				}, function(err) {
					socket.emit('instance.deleted');
					console.log('Could not delete instance', err);
				});
			}, function(err) {
				console.log('IDENTIFY SERVER ERROR', err);
			}, this);



		}, function(err) {
			console.log('ERR', err);
		}, this)
	};

	module.exports = Callback;

})(this);
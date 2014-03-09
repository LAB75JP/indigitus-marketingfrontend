
/*
 * HELPERS
 */

var _Nova   = require('openclient').Nova;
var _CONFIG = require('../lib/config/config');

/*
 * IMPLEMENTATION
 */

(function(global) {

	console.log('CONFIG', _CONFIG);

	var _server = null;
	var _client = new _Nova({
		url:           _CONFIG.nova,
		debug:         true,
		enforce_https: false
	});



	/*
	 * CHAINED REST API CALLS
	 */

	var _authenticate = function(success, error, scope) {

		_client.authenticate({
			username: _CONFIG.username,
			password: _CONFIG.password,
			project:  _CONFIG.project,

			success: function(tokens) {
				success.call(scope, tokens);
			},
			error: function(err) {
				error.call(scope, err);
			}
		});

	};

	var _clone_template = function(success, error, scope) {

		_client.servers.all({

			endpoint_type: 'publicURL',

			success: function(servers) {

				var template = null;
				for (var s = 0, sl = servers.length; s < sl; s++) {

					if (servers[s].name === _CONFIG.template) {
						template = servers[s];
						break;
					}

				}


				if (template !== null) {

					var data = {
						name:      _CONFIG.instance + servers.length,
						imageRef:  template.image.links[0].href,
						flavorRef: template.flavor.links[0].href,
						networks:  _CONFIG.networks,
						key_name:  _CONFIG.sshkey || ''
					};

					success.call(scope, data);

				} else {
					error.call(scope, 'Template "' + _CONFIG.template + '" not found.');
				}

			},
			error: function(err) {
				error.call(scope, err);
			}
		})

	};

	var _create_server = function(data, success, error, scope) {

		_client.servers.create({
			endpoint_type: 'publicURL',
			data: data,

			success: function(data) {
				success.call(scope, data);
			},
			error: function(err) {
				error.call(scope, err);
			}
		})

	};

	var _delete_server = function(id) {

		_client.servers.del({
			endpoint_type: 'publicURL',
			id:    id,
			async: false
		});

	};

	var _assign_ip = function(server, success, error, scope) {

		_client.floating_ips.available({
			endpoint_type: 'publicURL',
			success: function(data) {

				if (data.length > 0) {

					// This timeout was added due to this error:
					// (400) "No nw_info cache associated with instance"

					setTimeout(function() {

						_client.servers.add_floating_ip({
							data: {
								id: server.id,
								address: floatingIp.ip
							},
							success: function(result) {
								success.call(scope, result);

							},
							error: function(err) {
								error.call(scope, err);
							}
						});

					}, 3000);

				} else {
					error.call(scope, 'No Floating IPs available');
				}

			},
			error: function(err) {
				error.call(scope, 'Could not retrieve floating IPs');
			}
		});

	};

	var _get_server = function(server, success, error, scope) {

		_client.servers.get({
			endpoint_type: 'publicURL',
			id: server.id,
			success: function(data) {
				success.call(scope, data);
			},
			error: function(err) {
				error.call(scope, 'Could not get server');
			}
		});

	};

	var _pollhandle = function(id) {

		this.id   = id;
		this.step = 0;


		var that = this;

		return function(value) {

			if (value === true) {

				clearInterval(that.id);

			} else if (value === false) {

				that.step++;

				if (that.step > 10) {
					clearInterval(that.id);
				}

			}

		};

	};

	var _poll = function(timeout, callback, scope) {

		var handle = new _pollhandle(1337);

		handle.id = setInterval(function() {
			callback.call(scope, handle);
		}, timeout);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Callback = function(data, socket) {

		var _step = function(msg){
			socket.emit('instance.step', {
				line: msg
			});
		};

		var _on_error = function(message) {

			socket.emit('instance.error', {
				line: message
			});

			if (_server !== null) {
				_delete_server(_server.id);
			}

		};

		_step('Booting up an Instance just for you...');
		_step('Authenticating...');

		_authenticate(function(tokens) {

			_step('Authentication successful.');
			_step('Clonging template ...');

			_clone_template(function(data) {

				_step('Creating server instance "' + data.name + '" ...');

				_create_server(data, function(server) {

					_server = server;

					_step('Assigning Floating IP to Instance ...');

					_assign_ip(server, function(result) {

						_step('Floating IP is ' + result);

						_poll(3000, function(handle) {

							_get_server(server, function(data) {

								if (
									   data instanceof Object
									&& data.status === 'ACTIVE'
									&& data.addresses
								) {

									var ip = null;

									if (data.addresses) {

console.log('ADDRESSES', typeof data.addresses, JSON.stringify(data.addresses, '\t'));

									}

									if (ip !== null) {

										_step('Server ready!');

										socket.emit('instance.ready', {
											ip: ip
										});


										handle(true);

										return;

									}

								}


								handle(false);

							}, _on_error, this);

						}, _on_error, this);

					}, _on_error, this);;

				}, _on_error, this);

			}, _on_error, this);

		}, _on_error, this);

	};


	module.exports = Callback;

})(this);



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


	var _is_public_ip = function(addr) {

		var tmp = addr.split('.');

		if (tmp[0] === '10')                      return false;
		if (tmp[0] === '192' && tmp[1] === '168') return false;
		if (tmp[0] === '172' && tmp[1] === '16')  return false;
		// TODO: 172.16 - 172.32


		return true;

	};



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
						key_name:  _CONFIG.template
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

		_client.floating_ips.all({
			endpoint_type: 'publicURL',
			success: function(data) {

				if (data.length > 0) {

					// This timeout was added due to this error:
					// (400) "No nw_info cache associated with instance"

					setTimeout(function() {

						_client.servers.add_floating_ip({
							endpoint_type: 'publicURL',
							data: {
								id: server.id
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

	var _pollhandle = function(id, steps) {

		steps = typeof steps === 'number' ? (steps | 0) : 60;


		this.id    = id;
		this.step  = 0;
		this.steps = steps;


		var that = this;

		return function(value) {

			if (value === true) {

				clearInterval(that.id);

			} else if (value === false) {

				that.step++;

				if (that.step > that.steps) {
					clearInterval(that.id);
				}

			}

		};

	};

	var _poll = function(timeout, callback, scope) {

		var handle;

		var id = setInterval(function() {

			if (handle === undefined) {
				handle = new _pollhandle(id);
			}

			callback.call(scope, handle);

		}, timeout);

	};



	/*
	 * IMPLEMENTATION
	 */

	var Callback = function(data, socket, ubercallback, uberscope) {

		var step  = 0;
		var steps = 8;

		var _step = function(msg) {

			step++;

			socket.emit('instance.step', {
				line: msg,
				percentage: (step / steps) * 100
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


		_step('Creating a new Instance just for you...');
		_step('Authenticating...');

		_authenticate(function(tokens) {

			_step('Authentication successful.');
			_step('Clonging template ...');

			_clone_template(function(data) {

				_step('Creating server instance "' + data.name + '" ...');

				_create_server(data, function(server) {

					_server = server;

					_step('Assigning Floating IP to Instance ...');

					_assign_ip(server, function() {

						_step('Booting up Instance ...');

						_poll(1000, function(handle) {

							_get_server(server, function(data) {

								if (
									   data instanceof Object
									&& data.status === 'ACTIVE'
									&& data.addresses
								) {

									var ip = null;

									if (data.addresses) {

										var network = Object.keys(data.addresses)[0];
										for (var iface = 0; iface < data.addresses[network].length; iface++) {

											var addr = data.addresses[network][iface].addr || null;
											if (_is_public_ip(addr) === true) {
   												ip = addr;
												break;
											}

										}

									}

									if (ip !== null) {

										_step('Server ready!');

										ubercallback.call(uberscope, {
											host: ip
										});


										socket.emit('instance.ready', {
											host: ip
										});

										handle(true);

									} else {

										_step('Booting up Instance ...');

										handle(true);
										_on_error.call(this, 'No public Floating IPs available');

									}

								} else {
									handle(false);
								}

							}, _on_error, this);

						}, _on_error, this);

					}, _on_error, this);;

				}, _on_error, this);

			}, _on_error, this);

		}, _on_error, this);

	};


	module.exports = Callback;

})(this);


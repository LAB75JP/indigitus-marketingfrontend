
/*
 * HELPERS
 */

var _Nova   = require('openclient').Nova;
var _CONFIG = require('../lib/config/config');


/*
 * IMPLEMENTATION
 */

(function(global) {

	var _server = null;
	var _client = new _Nova({
		url:           _CONFIG.nova,
		debug:         true,
		enforce_https: true
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

					_client.servers.add_floating_ip({
						id: server.id,
						success: function(result) {
							success.call(scope, result);
						},
						error: function(err) {
							error.call(scope, 'Could not assign Floating IP to instance');
						}
					});

				} else {
					error.call(scope, 'No Floating IPs available');
				}

			},
			error: function(err) {
				error.call(scope, 'Could not retrieve floating IPs');
			}
		});

	};


	var Callback = function(data, socket) {

		var _on_error = function(message) {

			socket.emit('instance.error', {
				line: message
			});

			if (_server !== null) {
				_delete_server(_server.id);
			}

		};



		socket.emit('instance.step', {
			line: 'Booting up an Instance just for you ...'
		});


		socket.emit('instance.step', {
			line: 'Authenticating ...'
		});

		_authenticate(function(tokens) {

			socket.emit('instance.step', {
				line: 'Authentication successful.'
			});

			socket.emit('instance.step', {
				line: 'Cloning template ...'
			});


			_clone_template(function(data) {

				socket.emit('instance.step', {
					line: 'Creating server instance "' + data.name + '" ...'
				});

				_create_server(data, function(server) {

					_server = server;

					socket.emit('instance.step', {
						line: 'Assigning Floating IP to instance ...'
					});

					_assign_ip(server, function(result) {

console.log('RESULT of ASSIGNMENT', result);
_on_error.call(this);

					}, _on_error, this);;

				}, _on_error, this);

			}, _on_error, this);

		}, _on_error, this);



return;

      var time = 0;
      var stepPresets = {
        1: 'Request Start of Instance',
        2: 'Instance booting',
        3: 'Setting up Phoronix Test Suite',
        4: 'Starting Lazers',
        5: 'Running Test Suite',
        6: 'Starting HTTP Server',
        7: 'etc. 1',
        8: 'etc. 2',
        9: 'etc. 3',
        10: 'etc. 4'
      };

      var send = function() {
        console.log('SEND SOMETHING');
        var scopePreset = '';
        time++;
        if (time > 10) {
          socket.emit('instance.ready');
        } else {
          scopePreset = stepPresets[time.toFixed()];
          if (scopePreset) {
            socket.emit('instance.step', {
              step: scopePreset
            });
          }
          myTimeout = setTimeout(send, 1000);
        }

      };

      var myTimeout = setTimeout(send, 1000);
	};


	module.exports = Callback;

})(this);


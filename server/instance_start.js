
/*
 * HELPERS
 */

var _Nova   = require('openclient').Nova;
var _CONFIG = require('../lib/config/config');


/*
 * IMPLEMENTATION
 */

(function(global) {

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

			endpoint_type: 'adminURL',

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


	var Callback = function(data, socket) {

		var _on_error = function(message) {

			socket.emit('instance.error', {
				line: message
			});

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


			_clone_template(function(instance) {

console.log(instance);

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


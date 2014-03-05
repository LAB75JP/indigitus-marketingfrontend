
(function (global) {

	var _ssh = require('ssh2');


	var Callback = function (data, socket) {

		var tunnel = new _ssh();

		tunnel.once('ready', function () {

			tunnel.exec(data.command, function (err, stream) {

				if (err) {

					socket.emit('instance.command_error', {
						error: err
					});

				} else {

					stream.on('data', function (line) {
						socket.emit('instance.command_output', {
							output: line.toString()
						});
					});

				}

				stream.on('exit', function () {
					socket.emit('instance.command_output', {
                        exit: true
                    });

                    tunnel.end();
				});

			});

		});

		var settings = {
			host: data.host,
			port: data.port
		};

		if (typeof data.username === 'string') {
			settings.username = data.username;
		}

		if (typeof data.password === 'string') {
			settings.password = data.password;
		}

		if (typeof data.key === 'string') {
			settings.privateKey = data.key;
		}

		tunnel.connect(settings);

	};

	module.exports = Callback;

})(this);



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

		tunnel.connect(data);

	};

	module.exports = Callback;

})(this);


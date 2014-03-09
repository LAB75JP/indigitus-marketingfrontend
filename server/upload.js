
(function (global) {

	var _fs  = require('fs');
	var _ssh = require('ssh2');

	var _on_end = function(socket, start) {

		socket.emit('upload', {
			start: start.toString(),
			end: Date.now().toString(),
			percentage: 100
		});

		this.end();

	};


	var Callback = function (data, socket) {

		var start = Date.now();

		var tunnel = new _ssh();

		tunnel.once('ready', function () {

			tunnel.sftp(function (err, sftp) {

				if (err) {

					_on_end.call(tunnel, socket, start);

				} else {

					var read  = _fs.createReadStream(__dirname + '/3oOQkCu.jpg');
					var write = sftp.createWriteStream('~/3oOQkCu.jpg');


					write.on('close', function() {
						_on_end.call(tunnel, socket, start);
					});

					var bytes = 0;

					read.on('data', function(chunk) {

						bytes += chunk.length;

						var percentage = (bytes / 1024 / 1024) / 11;

						socket.emit('upload', {
							start: start,
							end:   Date.now().toString(),
							percentage: percentage
						})

					});


					read.pipe(write);

				}

			});

			tunnel.on('error', function() {
				_on_end.call(tunnel, socket, start);
			});

			tunnel.on('end', function() {
				_on_end.call(tunnel, socket, start);
			});

		});

		tunnel.connect(data);

	};


	module.exports = Callback;

})(this);


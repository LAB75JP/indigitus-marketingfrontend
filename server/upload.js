
(function (global) {

	var _ssh = require('ssh2');


	var Callback = function (data, socket) {

		var start = Date.now();

		var tunnel = new _ssh();

		tunnel.once('ready', function () {

			tunnel.sftp(function (err, sftp) {

				sftp.on('end', function(data) {

					socket.emit('upload', {
						start:      start.toString(),
						end:        Date.now().toString(),
						percentage: 100
					});

					tunnel.end();

				});

				sftp.fastPut(__dirname + '/3oOQkCu.jpg', '/3oOQkCu.jpg', {
					step: function(done, chunk, total) {

console.log(done, chunk, total);

					}
				});

			});

		});

		tunnel.connect(data);

	};


	module.exports = Callback;

})(this);



(function (global) {

	var _ssh = require('ssh2');

	var _parse = function (line) {

		var str = line.split(' ');
		if (
				 typeof str[5] === 'string'
			&& str[str.length - 4].substr(0, 9) === 'icmp_seq='
			&& str[str.length - 2].substr(0, 5) === 'time='

		) {
			console.log('STRING', str);
			var from = '';
			if(str[4] !== 'bytes'){
				from = str[3] + ' ' + str[4]
			}
			return {
				line:     line,
				sequence: parseInt(str[str.length - 4].substr(9), 10),
				time:     parseFloat(str[str.length - 2].substr(5), 10),
				from: from
			};

		} else {

			return {
				sequence: 0,
				time:     0
			};

		}

	};


	var Callback = function (data, socket) {

		var tunnel = new _ssh();

		tunnel.once('ready', function () {

			tunnel.exec('ping -c 10 ' + data.target, function (err, stream) {

				stream.on('data', function (line) {

					var data = _parse(line.toString());
					if (data !== null) {
						socket.emit('ping', data);
					}

				});

				stream.on('exit', function () {
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


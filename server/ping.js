
(function (global) {

	var _ssh = require('ssh2');

	var _parse = function (line) {

		var str = line.split(' ');
		if (
			str.length > 5
			// Thanks to Debian, wasting 2 hours of time, you stupid fuckers!
			// https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=609853
			&& (
//				   str[str.length - 4].substr(0, 9) === 'icmp_seq='
//				|| str[str.length - 4].substr(0, 9) === 'icmp_req='
                str[str.length - 4].substr(0, 4) === 'seq='
			)
			&& str[str.length - 2].substr(0, 5) === 'time='
		) {

			return {
				line:     line,
				//sequence: parseInt(str[str.length - 4].substr(9), 10),
                sequence: parseInt(str[str.length - 4].substr(4), 10),
				time:     parseFloat(str[str.length - 2].substr(5), 10)
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

		tunnel.connect(data);

	};


	module.exports = Callback;

})(this);


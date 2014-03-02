
(function(global) {

	var _exec = require('child_process').exec;
	var _ssh  = require('ssh2');

	var _parse = function(line) {

		var str = line.split(' ');
		if (str[0].match(/\n([0-9]{1,4})/)) {

			var data = {
				host:     str[3].match(/\(/g) ? str[3] : str[2],
				sequence: parseInt(str[0], 10)
			};

			console.log(data);

			return data;

		}


		return null;

	};


	var Callback = function(data, socket) {

		var tunnel = new _ssh();


		tunnel.once('ready', function() {

			tunnel.exec('traceroute ' + data.target, function(err, stream) {

				stream.on('data', function(line) {

					var data = _parse(line.toString());
					if (data !== null) {
						socket.emit('traceroute', data);
					}

				});

				stream.on('exit', function() {
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


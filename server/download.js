
var _urls = {
	'imgur.com': 'http://i.imgur.com/3oOQkCu.jpg'
};


(function(global) {

	var _exec = require('child_process').exec;
	var _ssh  = require('ssh2');

	var _parse = function(line) {

		var str = line.split(' ');
		for (var s = 0, sl = str.length; s < sl; s++) {

			if (
				   str[s][0] === '.'
				|| str[s] === ''
			) {

				str.splice(s, 1);
				sl--;
				s--;

			}

		}


		if (str[0].indexOf('%') !== -1) {

			var data = {
				percentage: parseInt(str[0].replace(/%/g, ''), 10)
			};


			return data;

		}


		return null;

	};


	var Callback = function(data, socket) {

		var tunnel = new _ssh();


		tunnel.once('ready', function() {

			tunnel.exec('wget --progress=dot ' + _urls['imgur.com'] + ' 2>&1', function(err, stream) {

				var buffer = '';

				stream.on('data', function(raw) {

					var str = raw.toString();

					if (str.match(/\n/)) {

						buffer += str;

						var data = _parse(buffer);
						if (data !== null) {
							socket.emit('download', data);
						}

						buffer = '';

					} else {

						buffer += str;

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

console.log(settings);

		tunnel.connect(settings);

	};


	module.exports = Callback;

})(this);


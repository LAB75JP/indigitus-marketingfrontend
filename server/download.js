
(function(global) {

	var _exec = require('child_process').exec;
	var _ssh  = require('ssh2');

	var _urls = {
		'imgur.com': 'http://i.imgur.com/3oOQkCu.jpg'
	};


	var _filter = function(str) {

		for (var s = 0, sl = str.length; s < sl; s++) {

			if (
				   str[s].substr(0, 1) === '.'
				|| str[s] === ''
			) {

				str.splice(s, 1);
				sl--;
				s--;

			}

		}


		return str;

	};

	var _parse = function(buffer, socket) {

		var lines = buffer.split('\n');
		for (var l = 0, ll = lines.length; l < ll; l++) {

			var str = _filter(lines[l].split(' '));
			if (
				typeof str[1] === 'string'
				&& str[1].indexOf('%') !== -1
			) {

				var data = {
					percentage: parseInt(str[1].replace(/%/g, ''), 10)
				};

				socket.emit('download', data);

			}

		}

	};


	var Callback = function(data, socket) {

		var start = Date.now();

		var tunnel = new _ssh();


		tunnel.once('ready', function() {

			tunnel.exec('wget --progress=dot ' + _urls['imgur.com'] + ' 2>&1', function(err, stream) {

				var buffer = '';

				stream.on('data', function(raw) {

					var str = raw.toString();
					if (str.match(/\n/)) {

						buffer += str.substr(0, str.indexOf('\n'));

						_parse(buffer, socket);

						buffer = str.substr(str.indexOf('\n') + 1);

					} else {

						buffer += str;

					}

				});

				stream.on('exit', function() {

					socket.emit('download', {
						start:      start.toString(),
						end:        Date.now().toString(),
						percentage: 100
					});

					tunnel.end();

				});

			});

		});

		tunnel.connect(data);

	};


	module.exports = Callback;

})(this);


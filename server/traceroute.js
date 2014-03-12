'use strict';
(function(global) {
	var userId = '87136';
	var licenseKey = 'QfOpNA9tgwy6';
	var _geo = require('geoip2ws')(userId, licenseKey);
	var _exec = require('child_process').exec;
	var _ssh = require('ssh2');

	var _filter = function(str) {

		for (var s = 0, sl = str.length; s < sl; s++) {

			if (
				str[s] === ''
			) {

				str.splice(s, 1);
				sl--;
				s--;

			}

		}


		return str;

	};
	var l = 0;
	var ll = 0;
	var _parse = function(buffer, socket) {
		var lines = buffer.split('\n');
		for (l = 0, ll = lines.length; l < ll; l++) {

			var str = _filter(lines[l].split(' '));

			if (
				typeof str[0] === 'string' && str[0].match(/([0-9]{1,4})/)
			) {

				var data = {
					line: lines[l],
					host: str[1],
					ip: str[2].replace(new RegExp("[\(\)]", "g"), ''),
					sequence: parseInt(str[0], 10),
					time: parseFloat(str[3], 10)
				};

				(function(data, l) {
					_geo(data.ip, function(err, response) {

						if (err) {
							data.location = null;
						} else {
							data.location = response.location;
						}

						console.log('DATA', data);
						console.log('LINE', ll);
						setTimeout(function() {
							socket.emit('traceroute', data);
						}, l * 1000);
					});
				})(data, l);

			}

		}

	};


	var Callback = function(data, socket) {

		var tunnel = new _ssh();


		tunnel.once('ready', function() {

			tunnel.exec('traceroute ' + data.target, function(err, stream) {

				var buffer = '';

				stream.on('data', function(raw) {

					var str = raw.toString();

					if (str.match(/\n/)) {

						buffer += str.substr(0, str.lastIndexOf('\n'));

						_parse(buffer, socket);

						buffer = str.substr(str.lastIndexOf('\n') + 1);

					} else {

						buffer += str;

					}

				});

				stream.on('exit', function() {
					setTimeout(function() {
						socket.emit('traceroute.stop');
					}, l * 1000)
					tunnel.end();
				});

			});

		});

		tunnel.on('error', function(err) {
			console.log('ERROR', err);
			setTimeout(function() {
				tunnel.connect(data);
			}, 1000);
		});

		tunnel.connect(data);

	};


	module.exports = Callback;

})(this);
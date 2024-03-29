(function(global) {

	var _ssh = require('ssh2');

	var FILTERED_FOLDERS = [
		'/etc/init.d',
		'/etc',
		'/sbin',
		'/usr/sbin'
	];

	var FILTERED_COMMANDS = [
		'apt-get',
		'yum',
		'emerge',
		'ssh',
		'sftp',
		'scp',
		'sshd',
		'service',
		'sed',
		'nano',
		'vi',
		'vim',
		'sudo',
		'su',
		'|'     // pipe is blocked
	];

	var AVAILABLE_COMMANDS = [
		'ls',
		'netstat',
		'ps',
		'ping',
		'date',
		'uptime'
	];



	var _filter = function(command) {

		var valid = false;

		console.log(command);
		var tmp = command.replace('#', '');
		tmp = tmp.split(' ');
		console.log('TMP', tmp);
		for (var t = 0, tl = tmp.length; t < tl; t++) {

			var str = tmp[t];
			for (var f = 0, fl = FILTERED_FOLDERS.length; f < fl; f++) {

				var folder = FILTERED_FOLDERS[f];
				if (str.substr(0, folder.length) === folder) {
					return null;
				}

			}

			if (FILTERED_COMMANDS.indexOf(str) !== -1) {
				return null;
			} else if (AVAILABLE_COMMANDS.indexOf(str) !== -1) {
				valid = true;
				break;
			}

		}

		if (!valid) {
			return null;
		}

		// EDGE CASES
		tmp = tmp.join(' ');

		if (tmp.indexOf('ping') !== -1) {
			if (tmp.indexOf('-c') === -1) {
				tmp += ' -c 10';
			}
		}

		return tmp;



	};


	var Callback = function(data, socket) {

		var tunnel = new _ssh();

		tunnel.once('ready', function() {

			var command = _filter(data.command);
			if (command === null) {

				return socket.emit('instance.command_error', {
					error: 'Not executed for security reasons.'
				});

			}

			tunnel.exec(command, function(err, stream) {

				if (err) {

					socket.emit('instance.command_error', {
						error: err.toString()
					});

				} else {

					var buffer = '';

					stream.on('data', function(raw) {

						var str = raw.toString();
						socket.emit('instance.command_output', {
							line: raw.toString()
						});

					});

				}

				stream.on('exit', function() {

					socket.emit('instance.command_output', {
						exit: true
					});

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

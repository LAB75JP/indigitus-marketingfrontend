
(function (global) {

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
		'ping',
		'traceroute',
		'sed',
		'nano',
		'vi',
		'vim',
		'sudo',
		'su'
	];

	var AVAILABLE_COMMANDS = [
		'ls',
		'cd',
		'cat',
		'grep',
		'pcregrep'
	];



	var _filter = function(command) {

		var valid = false;

		var tmp = command.split(' ');
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


		if (valid === true) {
			return tmp.join(' ');
		}


		return null;

	};


	var Callback = function (data, socket) {

		var tunnel = new _ssh();

		tunnel.once('ready', function () {

			var command = _filter(data.command);
			if (command === null) {

				socket.emit('instance.command_error', {
					error: 'Not executed for security reasons.'
				});

			}

			tunnel.exec(command, function (err, stream) {

				if (err) {

					socket.emit('instance.command_error', {
						error: err.toString()
					});

				} else {

					var buffer = '';

					stream.on('data', function (raw) {

						var str = raw.toString();
						if (str.match(/\n/)) {

							buffer += str.substr(0, str.indexOf('\n'));

							socket.emit('instance.command_output', {
								line: buffer
							});

							buffer = str.substr(str.indexOf('\n') + 1);

						}

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


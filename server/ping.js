
(function(global) {

	var _exec = require('child_process').exec;

	var _parse = function(line) {

		var str = line.split(' ');

		if (
			   typeof str[5] === 'string'
			&& str[5].substr(0, 4) === 'icmp'
		) {

console.log('PARSING PING LINE', str);

		} else {

console.log('RESULT PING LINE', str);

		}

	};


	var Callback = function(socket, host) {

		this.exec('ping -c 20 ' + host, function(err, stream) {

			stream.on('data', function(line) {
				var data = _parse(line.toString());
				socket.emit('ping', data);
			});

		});

	};


	module.exports = Callback;

})(this);


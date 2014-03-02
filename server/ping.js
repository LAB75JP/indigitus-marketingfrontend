
(function(global) {

	var _exec = require('child_process').exec;

	var _parse = function(line) {

		var str = line.split(' ');

		var data = {
			sequence: null,
			time: null
		};

		if (
			   typeof str[5] === 'string'
			&& str[5].substr(0, 9) === 'icmp_seq='
			&& str[7].substr(0, 5) === 'time='
		) {

			data.sequence = parseInt(  str[5].substr(9), 10);
			data.time     = parseFloat(str[7].substr(5), 10);

		} else {

console.log('RESULT PING LINE', str);

		}


		return data;

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


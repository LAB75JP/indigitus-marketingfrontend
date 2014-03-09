
/*
 * WEBSOCKET SERVER
 */

var _fs = require('fs');

(function () {

	/*
	 * HELPERS
	 */

	var _extend_data = function(data) {

		if (typeof data.host !== 'string') {
			data.host = '54.72.71.168';
		}


		/*
		 * This is done here to be sure the data is up2date
		 * TODO: Move this to server/instance_create logic
		 */

		var path    = __dirname + '/../lib/config/ssh/target/' + data.host;
    	var _config = JSON.parse(_fs.readFileSync(path + '.json'));

		var _key = null;
		try {
			_key = _fs.readFileSync(path + '.id_rsa');
		} catch(e) {
		}

		if (_config !== null && _key !== null) {
			_config.privateKey = _key;
		}


		if (_config !== null) {

			data.host = _config.host;
			data.port = _config.port;

			data.username = _config.username;

			if (_config.password !== null) {
				data.password = _config.password;
			}

			if (_config.privateKey !== null) {
				data.privateKey = _config.privateKey;
			}

		}

	};



	/*
	 * IMPLEMENTATION
	 */

    var server = function (httpserver) {

        var socketio         = require('socket.io');
        var ping             = require('./ping.js');
        var download         = require('./download.js');
        var traceroute       = require('./traceroute.js');
        var instance_start   = require('./instance_start.js');
        var instance_command = require('./instance_command.js');
        var instance_delete  = require('./instance_delete.js');


        var wsserver = socketio.listen(httpserver);

        wsserver.sockets.on('connection', function (socket) {

            socket.on('ping', function (data) {
				_extend_data(data);
                ping(data, socket);
            });

            socket.on('download', function (data) {
				_extend_data(data);
                download(data, socket);
            });

            socket.on('traceroute', function (data) {
				_extend_data(data);
                traceroute(data, socket);
            });

            socket.on('instance.delete', function(data){
				_extend_data(data);
                instance_delete(data, socket);
            });

            socket.on('instance.command', function (data) {
				_extend_data(data);
                instance_command(data, socket);
            });

            socket.on('instance.start', function (data) {
                instance_start(data, socket);
            });

        });

    };

    module.exports = server;

})();


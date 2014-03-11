

/*
 * WEBSOCKET SERVER
 */

var _CONFIG = require('../lib/config/config');
var _fs     = require('fs');
var simpleRecaptcha = require('simple-recaptcha');
var userId = _CONFIG.mindMax.userId;
var licenseKey = _CONFIG.mindMax.licenseKey;
var _geo  = require('geoip2ws')(userId, licenseKey);

(function () {

	/*
	 * HELPERS
	 */

	var _template_config = _fs.readFileSync(__dirname + '/../lib/config/ssh/' + _CONFIG.environment + '/' + _CONFIG.template + '.json');
	var _template_key    = _fs.readFileSync(__dirname + '/../lib/config/ssh/' + _CONFIG.environment + '/' + _CONFIG.template + '.id_rsa');

	var _create_profile = function(data) {

		console.log('CREATING PROFILE FOR INSTANCE ' + data.host);

		if (typeof data.host === 'string') {

			var path   = __dirname + '/../lib/config/ssh/target/' + data.host;
			var config = JSON.parse(_template_config);

			for (var prop in data) {
				config[prop] = data[prop];
			}

			var profile = JSON.stringify(config, '\t');
			var key     = _template_key;

			_fs.writeFileSync(path + '.json',   profile);
			_fs.writeFileSync(path + '.id_rsa', key);

		}

	};

	var _dispatch_profile = function(data) {

		if (typeof data.host !== 'string') {
			data.host = '54.72.53.7';
		}


		/*
		 * This is done here to be sure the data is up2date
		 * TODO: Move this to server/instance_create logic
		 */

		var path    = __dirname + '/../lib/config/ssh/target/' + data.host;
    	var _config = JSON.parse(_fs.readFileSync(path + '.json'));

		var _key = null;
		try {
			_key = _fs.readFileSync(path + '.id_rsa').toString();
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

    var server = function (httpserver, app) {
		
        var socketio         = require('socket.io');
        var ping             = require('./ping.js');
        var download         = require('./download.js');
        var upload           = require('./upload.js');
        var traceroute       = require('./traceroute.js');
        var instance_start   = require('./instance_start.js');
        var instance_command = require('./instance_command.js');
        var instance_delete  = require('./instance_delete.js');


		var that     = this;
        var wsserver = socketio.listen(httpserver);

        wsserver.sockets.on('connection', function (socket) {
			socket.captcha_valid = false;
				
            socket.on('ping', function (data) {
				_dispatch_profile(data);
                ping(data, socket);
            });

            socket.on('download', function (data) {
				_dispatch_profile(data);
                download(data, socket);
            });

            socket.on('upload', function (data) {
				_dispatch_profile(data);
                upload(data, socket);
			});

            socket.on('traceroute', function (data) {
				console.log('TRACEROUTE');
				_dispatch_profile(data);
                traceroute(data, socket);
            });

            socket.on('instance.delete', function(data){
				_dispatch_profile(data);
                instance_delete(data, socket);
            });

            socket.on('instance.command', function (data) {
				_dispatch_profile(data);
                instance_command(data, socket);
            });

            socket.on('instance.start', function (data) {
				if(socket.captcha_valid || _CONFIG.environment === 'development'){
					instance_start(data, socket, _create_profile, that);
				}
            });
			
			socket.on('instance.get_location', function(data){
				var host = data.host;
				_geo(host, function (err, response) {
					if(!err){
						socket.emit('instance.location', response.location);
					}
				});	
			});
			
			socket.on('captcha.validate', function(data){
				console.log(arguments);
				var privateKey = _CONFIG.recaptcha.privateKey;
				var challenge = data.challenge;
				var response = data.response;
				console.log('SOCKET CONNECTION', socket.handshake);
				var ip = socket.handshake.address.address;
				simpleRecaptcha(privateKey, ip, challenge, response, function(err) {
			  		socket.captcha_valid = false;
					if (err) {
				  		return socket.emit('captcha.invalid', {err: err.message});
				  	}
					socket.captcha_valid = true;
					socket.emit('captcha.valid', {success: true})		
				});
				
			});
			


        });

    };

    module.exports = server;

})();



/*
 * WEBSOCKET SERVER
 */

var _fs = require('fs');

(function () {

    var server = function (httpserver) {

        var socketio         = require('socket.io');
        var ping             = require('./ping.js');
        var download         = require('./download.js');
        var traceroute       = require('./traceroute.js');
        var instance_start   = require('./start_instance.js');
        var instance_command = require('./command_instance.js');

        var instance_ip = "127.0.0.1";
        var _config = JSON.parse(_fs.readFileSync(__dirname + '/../lib/config/ssh/' + instance_ip + '.json'));


        var wsserver = socketio.listen(httpserver);

        wsserver.sockets.on('connection', function (socket) {

            socket.on('ping', function (data) {

                data.host = _config.host;
                data.port = _config.port;
                data.username = _config.username;
                data.password = _config.password;
                ping(data, socket);

            });

            socket.on('download', function (data) {

                data.host = _config.host;
                data.port = _config.port;
                data.username = _config.username;
                data.password = _config.password;
                download(data, socket);

            });

            socket.on('traceroute', function (data) {

                data.host = _config.host;
                data.port = _config.port;
                data.username = _config.username;
                data.password = _config.password;
                traceroute(data, socket);

            });

            socket.on('instance.command', function (data) {

                data.host = _config.host;
                data.port = _config.port;
                data.username = _config.username;
                data.password = _config.password;
                instance_command(data, socket);

            });

            socket.on('instance.start', function (data) {
                instance_start(data, socket);
            });

        });

    };

    module.exports = server;

})();


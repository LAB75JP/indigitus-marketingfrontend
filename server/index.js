/*
 * WEBSOCKET SERVER
 */
var _fs = require('fs');

var wsserver = null;

(function () {

    var server = function (httpserver) {
        var socketio = require('socket.io');
        var ping = require('./ping.js');
        var download = require('./download.js');
        var upload = require('./upload.js');
        var traceroute = require('./traceroute.js');
        var startInstance = require('./start_instance.js');
        var command = require('./command.js');

        var instanceIp = "127.0.0.1";
        var _config = JSON.parse(_fs.readFileSync(__dirname + '/../lib/config/ssh/' + instanceIp + '.json'));

        wsserver = socketio.listen(httpserver);
        wsserver.sockets.on('connection', function (socket) {

            socket.on('ping', function (data) {

                data.host = _config.host;
                data.port = _config.port;
                data.username = _config.username;
                data.password = _config.password;
                ping(data, socket);

            });

            socket.on('instance.start', function (data) {
                startInstance(data, socket);
            });
            
            socket.on('upload', function(data){
                
                data.host = _config.host;
                data.port = _config.port;
                data.username = _config.username;
                data.password = _config.password;
                upload(data, socket);
                
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
                command(data, socket);
                
            });

        });
    };
    module.exports = server;

})();
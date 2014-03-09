
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
        var instance_start   = require('./instance_start.js');
        var instance_command = require('./instance_command.js');
        var instance_delete = require('./instance_delete.js');

        var _config = require('../lib/config/config');

        var wsserver = socketio.listen(httpserver);

        wsserver.sockets.on('connection', function (socket) {

            socket.on('ping', function (data) {

                data.key = _config.sshkey;
                data.port = _config.sshport;
                ping(data, socket);

            });

            socket.on('download', function (data) {

                data.key = _config.sshkey;
                data.port = _config.sshport;
                download(data, socket);

            });

            socket.on('traceroute', function (data) {

                data.key = _config.sshkey;
                data.port = _config.sshport;
                traceroute(data, socket);

            });
            
            socket.on('instance.delete', function(data){
                
                data.key = _config.sshkey;
                data.port = _config.sshport;
                instance_delete(data, socket);
                
            });

            socket.on('instance.command', function (data) {

                data.key = _config.sshkey;
                data.port = _config.sshport;
                instance_command(data, socket);

            });

            socket.on('instance.start', function (data) {
                instance_start(data, socket);
            });

        });

    };

    module.exports = server;

})();


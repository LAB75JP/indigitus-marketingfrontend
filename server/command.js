
(function (global) {

    var _ssh = require('ssh2');

    var Callback = function (data, socket) {

        var tunnel = new _ssh();
        tunnel.once('ready', function () {
            tunnel.exec(data.command, function (err, stream) {
                stream.on('data', function (raw) {
                    if (err) {
                        socket.emit('instance.command_error', {
                            err: err
                        });
                    }
                    socket.emit('instance.command_output', {output: raw + ''});
                });
                stream.on('exit', function () {
                    tunnel.end();   
                });
            });
        });

        var settings = {
            host: data.host,
            port: data.port
        };

        if (typeof data.username === 'string') {
            settings.username = data.username;
        }

        if (typeof data.password === 'string') {
            settings.password = data.password;
        }

        if (typeof data.key === 'string') {
            settings.privateKey = data.key;
        }

        tunnel.connect(settings);

    };

    module.exports = Callback;

})(this);
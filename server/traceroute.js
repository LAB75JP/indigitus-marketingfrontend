'use strict';
(function (global) {
    var userId = '87136';
    var licenseKey = 'QfOpNA9tgwy6';
    var _geo = require('geoip2ws')(userId, licenseKey);
    var _exec = require('child_process').exec;
    var _ssh = require('ssh2');

    var _filter = function (str) {

        for (var s = 0, sl = str.length; s < sl; s++) {

            if (
                str[s] === ''
            ) {

                str.splice(s, 1);
                sl--;
                s--;

            }

        }


        return str;

    };

    var _parse = function (buffer, socket) {

        var lines = buffer.split('\n');
        for (var l = 0, ll = lines.length; l < ll; l++) {

            var str = _filter(lines[l].split(' '));
            if (
                typeof str[0] === 'string' && str[0].match(/([0-9]{1,4})/)
            ) {

                var ip = str[2].replace(new RegExp("[\(\)]", "g"), '');
                var data = {
                    line: lines[l],
                    host: str[1],
                    ip: ip,
                    sequence: parseInt(str[0], 10),
                    time: parseFloat(str[3], 10)
                };

                _geo(ip, function (err, response) {
                    console.log('GEOIP ERROR');
                    console.log(err);
                    if (err) {
                        return socket.emit('traceroute', data);
                    }
                    console.log('GEOIP RESULT');
                    console.log(response);
                    if(response.location){
                        data.location = response.location;
                    }

                    socket.emit('traceroute', data);
                });


            }

        }

    };


    var Callback = function (data, socket) {

        var tunnel = new _ssh();


        tunnel.once('ready', function () {

            tunnel.exec('traceroute ' + data.target, function (err, stream) {

                var buffer = '';

                stream.on('data', function (raw) {

                    var str = raw.toString();
                    if (str.match(/\n/)) {

                        buffer += str.substr(0, str.indexOf('\n'));

                        _parse(buffer, socket);

                        buffer = str.substr(str.indexOf('\n') + 1);

                    } else {

                        buffer += str;

                    }

                });

                stream.on('exit', function () {
                    socket.emit('traceroute.stop');
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

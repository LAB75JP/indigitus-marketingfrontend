(function (global) {

  var _ssh = require('ssh2');
  var _ping = require('./ping.js');
  var _traceroute = require('./traceroute.js');


  var _tunnel = new _ssh();


  module.exports = {

    ping: function (socket, host) {
      _ping.call(_tunnel, socket, host);
    },

    traceroute: function (socket, host) {
      _traceroute.call(_tunnel, socket, host);
    },

    connect: function (data, callback, scope) {

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


      // TODO: Pull request for ssh2
      try {
        console.log('END');
        console.log(_tunnel.end());
      } catch (e) {

      }


      _tunnel.once('ready', function () {
        console.log('READY');
        callback.call(scope);
      });

      _tunnel.connect(settings);

    }

  };

})(this);
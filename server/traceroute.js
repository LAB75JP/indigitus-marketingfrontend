(function (global) {

  var _parse = function (str) {
    return str;
  };

  var Callback = function (socket, host) {

    this.exec('traceroute ' + host, function (err, stream) {

      stream.on('data', function (line) {
        var data = _parse(line.toString());
        console.log('DATA', data);
        /*socket.emit('ping', data);*/
      });
      stream.on('exit', function () {

      });

    });

  };


  module.exports = Callback;

})(this);
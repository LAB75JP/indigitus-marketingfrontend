
var Connection = require('ssh2');

(function() {

  var Instance = function(io) {
    this._io = io;
    this.setup();
  };

  Instance.prototype.traceroute = function() {

  };

  Instance.prototype.ping = function() {

  };

  Instance.prototype.upload = function() {

  };

  Instance.prototype.download = function() {

  };

  Instance.prototype._getConnection = function(cb) {

    var c = new Connection();
    c.on('error', function(err) {
      console.log('Connection :: error :: ' + err);
    });
    c.on('end', function() {
      console.log('Connection :: end');
    });
    c.on('close', function() {
      console.log('Connection :: close');
    });
    c.on('ready', function() {
      this._c = c;
      return cb(c);
    }.bind(this));

  };

  Instance.prototype.execute = function(command, cb) {

    if (command.indexOf('ping') !== -1) {
      if (command.indexOf('-c') === -1) {
        command = command + ' -c 10';
      }
    }
    this._getConnection(function(c) {
      c.exec(command, function(err, stream) {

        var output = '';
        if (err) {
          cb(err);
          return;
        }
        stream.on('data', function(data) {
          output = data + '';
          cb(null, {
            output: output
          });
        });

        stream.on('exit', function(code, signal) {
          cb(null, {
            exit: true,
            signal: signal,
            code: code
          });
          c.end();
        });
      });

    });

  };

  Instance.prototype.executeCommand = function(command, cb) {
    this._getConnection(function(c) {
      c.exec(command, function(err, stream) {

        var output = '';
        stream.on('data', function(data) {
          output = output + data + '';
        });

        stream.on('exit', function(code, signal) {
          cb(null, {
            output: output,
            exit: true,
            signal: signal,
            code: code
          });
        });

      });
    });
  };

  Instance.prototype.setup = function() {
    this._io.sockets.on('connection', function(socket) {
      console.log(socket.id);
      this._socket = socket;
      socket.on('instance.start', this.start.bind(this));
      socket.on('instance.command', this.command.bind(this));
    }.bind(this));

    // this.executeCommand('sudo apt-get install wget', function(err, res) {
    //   console.log(res);
    // });
  };

  Instance.prototype.command = function(data) {
    this.execute(data.command, function(err, output) {
      if (err) {
        this._socket.emit('instance.command_error', {
          err: err
        });
      }
      this._socket.emit('instance.command_output', output);

    }.bind(this));
  };

  Instance.prototype.start = function() {
    var time = 0;
    var stepPresets = {
      1: 'Request Start of Instance',
      2: 'Instance booting',
      3: 'Setting up Phoronix Test Suite',
      4: 'Starting Lazers',
      5: 'Running Test Suite',
      6: 'Starting HTTP Server',
      7: 'etc. 1',
      8: 'etc. 2',
      9: 'etc. 3',
      10: 'etc. 4'
    };

    var send = function() {
      var scopePreset = '';
      time++;
      if (time > 10) {
        this._socket.emit('instance.ready');
      } else {
        scopePreset = stepPresets[time.toFixed()];
        if (scopePreset) {
          this._socket.emit('instance.step', {
            step: scopePreset
          });
        }
        myTimeout = setTimeout(send.bind(this), 1000);
      }

    };

    var myTimeout = setTimeout(send.bind(this), 1000);

  };

  module.exports = Instance;
})();

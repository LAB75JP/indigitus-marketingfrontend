
(function(global) {

	var Callback = function(data, socket) {
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
        console.log('SEND SOMETHING');
        var scopePreset = '';
        time++;
        if (time > 10) {
          socket.emit('instance.ready');
        } else {
          scopePreset = stepPresets[time.toFixed()];
          if (scopePreset) {
            socket.emit('instance.step', {
              step: scopePreset
            });
          }
          myTimeout = setTimeout(send, 1000);
        }

      };

      var myTimeout = setTimeout(send, 1000);
	};


	module.exports = Callback;

})(this);


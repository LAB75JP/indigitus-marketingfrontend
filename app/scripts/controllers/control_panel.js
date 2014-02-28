'use strict';

var pings = [];
var sample = {
  bytes: 64,
  from: '173.194.70.101',
  icmp_seq: 0,
  ttl: 50,
  time: 56.909
};

var initSample = function(i) {
  var sample = {
    bytes: 64,
    from: '173.194.70.101',
    icmp_seq: 0,
    ttl: 50,
    time: 56.909
  };
  sample.time = 50 + (Math.random() * 10);
  sample.icmp_seq = i;
  pings[i] = sample;
}

for (var i = 0; i < 10; i++) {
  initSample(i);
};

var pingsData = [{
  key: 'Pings',
  values: []
}];

for (var i = 0; i < pings.length; i++) {
  var label = pings[i].icmp_seq;
  pingsData[0].values.push([label, pings[i].time]);
}

console.log(pingsData);


angular.module('indigitusMarketingApp')
  .controller('ControlPanelCtrl', function($scope, $http, $location) {
    $scope.command = '';
    $scope.pingsData = pingsData;
    $scope.ping = function() {};
    $scope.traceroute = function() {};
    $scope.commands = [];
    $scope.terminalLines = [];

    $scope.availableCommands = [
      'You have a limited set of commands available for testing out the instance:',
      'ls: Description',
      'ping: Description',
      'traceroute: Description'
    ];
    var terminal = null;

    socket.on('instance.command_output', function(data) {
      console.log('DATA');
      console.log(data);
      terminal.pause();
      if (data.exit) {
        terminal.resume();
      }
      if (data.code == 127) {
        terminal.error('type "help" for available commands');
      }
      if (data.output) {
        terminal.echo(data.output);
      }

      terminal.resume();
    });

    $scope.onTerminalInput = function(command, term) {
      terminal = term;
      if (command === 'help') {
        var sep = '\n';
        term.echo(sep + sep + $scope.availableCommands.join(sep) + sep);
        return;
      } else {
        socket.emit('instance.command', {
          command: command
        });
        term.pause();
        //term.error('-bash: ' + command + ' command not found');
      }
    }

  });
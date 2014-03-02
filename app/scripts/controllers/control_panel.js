'use strict';
var pings = [];

var initSample = function (i) {
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
};

for (var i = 0; i < 10; i++) {
  initSample(i);
}

var pingsData = [{
  key: 'Pings',
  values: []
}];

for (var i = 0; i < pings.length; i++) {
  var label = pings[i].icmp_seq;
  pingsData[0].values.push([label, pings[i].time]);
}

angular.module('indigitusMarketingApp')
  .controller('ControlPanelCtrl', function ($scope, $http, $location, socket) {

    $scope.fetchData = function () {

      return [{
        key: 'hello',
        values: [['hello', 1]]
      }]

    };
    $scope.pingsData = $scope.fetchData();

    setInterval(function () {
      $scope.$apply(function () {
        var data = $scope.pingsData;
        data[0].values.push(['hello' + Math.random() * 3, Math.random() * 60]);

        $scope.pingsData = data;
        console.log($scope.pingsData);
      })
    }, 1000);

    socket.connect();

    window.socket = socket;

    $scope.instanceIp = '10.20.30.40';

    $scope.ping = function () {};

    $scope.barColor = function () {
      return '#000';
    };

    $scope.traceroute = function () {
      console.log('TEST!');
    };

    $scope.colorFunction = function () {
      console.log('COLOR FUNCTION');
      return '#000';
    };

    $scope.upload = function () {};
    $scope.download = function () {};
    $scope.command = '';
    $scope.commands = [];
    $scope.terminalLines = [];
    $scope.availableCommands = [
      'You have a limited set of commands available for testing out the instance:',
      'ls: Description',
      'ping: Description',
      'traceroute: Description'
    ];

    var terminal = null;

    socket.on('instance.command_output', function (data) {
      terminal.pause();
      if (data.exit) {
        terminal.resume();
      }
      if (data.code === 127) {
        terminal.error('type "help" for available commands');
      }
      if (data.output) {
        terminal.echo(data.output);
      }
      terminal.resume();
    });

    $scope.onTerminalInput = function (command, term) {
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
      }
    };


  });
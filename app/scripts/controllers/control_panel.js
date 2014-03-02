'use strict';


angular.module('indigitusMarketingApp')
  .controller('ControlPanelCtrl', function ($scope, $http, $location, socket) {

    $scope.pingsItem = 0;
    $scope.pingsData = [{
      key: 'Pings',
      values: []
    }];

    for (var i = 1; i <= 20; i++) {
      $scope.pingsData[0].values.push([i, 0]);
    }

    // TODO: Update instanceIp via REST API calls
    $scope.instanceIp = '54.72.38.49';

    socket.on('ping', function (data) {
      console.log('PING RESULT', data);
      $scope.pingsItem++;
      $scope.pingsItem %= 10;
      $scope.$apply(function () {
        $scope.pingsData[0].values[$scope.pingsItem] = [data.sequence, data.time];
      });

    });

    $scope.ping = function () {
      socket.emit('ping', {
        target: 'martens.ms',
        start: Date.now()
      });
    };


    /*    setInterval(function () {
      $scope.$apply(function () {
        var data = $scope.pingsData;
        data[0].values.push(['hello' + Math.random() * 3, Math.random() * 60]);

        $scope.pingsData = data;
        console.log($scope.pingsData);
      })
    }, 1000);*/


    $scope.barColor = function () {
      return '#000';
    };

    $scope.traceroute = function () {

      socket.emit('traceroute', {
        target: 'lycheejs.org',
        start: Date.now()
      });

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
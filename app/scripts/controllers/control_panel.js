'use strict';


angular.module('indigitusMarketingApp')
  .controller('ControlPanelCtrl', function ($scope, $http, $location, socket) {

    // TODO: Update instanceIp via REST API calls
    $scope.instanceIp = '54.72.38.49';



	/*
	 * PING
	 */

    $scope.pingsActive = false;
	$scope.pingsAverage = 0;
    $scope.pingsItem = 0;
    $scope.pingsData = [{
      key: 'Pings',
      values: []
    }];


    socket.on('ping', function (data) {
	  if (data === null) return;
      $scope.pingsItem++;
      $scope.pingsItem %= 10;
      $scope.$apply(function () {
	    var total = 0;
		var values = $scope.pingsData[0].values;
	    //for (var v = 0, vl = values.length; v < vl; v++) {
		//  console.log(values[v]);
		  // total += values[v][1];
		//}
		$scope.pingsAverage = (total / $scope.pingsData[0].values.length).toFixed(2);
        $scope.pingsData[0].values[$scope.pingsItem] = [data.sequence, data.time];
		if ($scope.pingsData[0].values.length === 10) {
		  $scope.pingsActive = false;
		}
      });

    });

    $scope.ping = function () {
	  if ($scope.pingsActive === true) return false;
	  $scope.pingsActive = true;
	  $scope.pingsItem = 0;
	  $scope.pingsData[0].values = [];
      socket.emit('ping', {
        target: 'google.com',
        start:  Date.now()
      });
    };



	/*
	 * TRACEROUTE
	 */

    $scope.tracerouteActive = false;
	$scope.tracerouteItem = 0;
	$scope.tracerouteData = [{
	  key: 'Traceroutes',
	  values: []
	}];

	socket.on('traceroute', function(data) {
	  if (data === null) return false;
	  console.log('TRACEROUTE RESULT', data);
	  $scope.$apply(function () {
	    $scope.tracerouteItem++;
		if (data.sequence > 0) {
	      $scope.tracerouteData[0].values[$scope.tracerouteItem] = [data.sequence + ' (' + data.host + ')', data.time];
		} else {
		  $scope.tracerouteActive = false;
		}
	  });
	});

	$scope.traceroute = function() {
	  if ($scope.tracerouteActive === true) return false;
	  $scope.tracerouteItem = 0;
	  socket.emit('traceroute', {
	    target: 'lycheejs.org',
		start: Date.now()
	  });
	};



	/*
	 * DOWNLOAD
	 */

	$scope.downloadPercentage = 0;

	socket.on('download', function(data) {
	  if (data === null) return;
	  $scope.$apply(function () {
	    $scope.downloadPercentage = data.percentage;
	  });
	});

	$scope.download = function() {
	  socket.emit('download', {
	    start: Date.now()
	  });
	};


    $scope.barColor = function () {
      return '#000';
    };

    $scope.colorFunction = function () {
      return '#000';
    };

    $scope.upload = function () {};
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


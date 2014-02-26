'use strict';

angular.module('indigitusMarketingApp')
    .controller('ControlPanelCtrl', function ($scope, $http, $location) {
        $scope.command = '';
        $scope.ping = function () {};
        $scope.traceroute = function () {};
        $scope.commands = [];
        $scope.terminalLines = [];
        $scope.availableCommands = [
            'You have a limited set of commands available for testing out the instance:',
            'ls: Description',
            'ping: Description',
            'traceroute: Description'
        ];
        $scope.onTerminalInput = function (command, term) {
            if (command === 'help') {
                var sep = '\n';
                term.echo(sep + sep + $scope.availableCommands.join(sep) + sep);
                return;
            } else {
                term.error('-bash: ' + command + ' command not found');
            }
        }

    });
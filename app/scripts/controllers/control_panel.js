'use strict';

angular.module('indigitusMarketingApp')
    .controller('ControlPanelCtrl', function ($scope, $http, $location) {
        $scope.command = '';
        $scope.ping = function () {};
        $scope.traceroute = function () {};
        $scope.commands = [];
        $scope.terminalLines = [];
        $scope.onTerminalInput = function (e) {
            console.log('ON TERMINAL INPUT');
            console.log($scope.command);


        }

    });
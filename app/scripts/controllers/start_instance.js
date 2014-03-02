'use strict';


angular.module('indigitusMarketingApp')
  .controller('StartInstanceCtrl', function($scope, $http, $location, $timeout, socket) {
    socket.connect();
    $scope.steps = [];
    $scope.timeLeft = 60;
    var decrease = function() {
      $scope.timeLeft--;
      if ($scope.timeLeft > 0) {
        $timeout(decrease, 1000);
      }
    };
    $timeout(decrease, 1000);

    socket.emit('instance.start');

    socket.on('instance.step', function(data) {
      console.log(data.step);
      $scope.steps.push(data.step);
    });

    socket.on('instance.ready', function(data) {
      console.log('ON INSTANCE READY');
      $location.path('/control_panel').replace();
    });


  });
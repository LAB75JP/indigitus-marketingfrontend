'use strict';

angular.module('indigitusMarketingApp')
  .controller('StartInstanceCtrl', function ($scope, $http, $location, $timeout) {
    $scope.stepPresets = {
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
    $scope.steps = [];
    $scope.time = 0;
    $scope.onTimeout = function () {
      $scope.time++;
      var scopePreset = $scope.stepPresets[$scope.time.toFixed()];
      console.log(scopePreset);
      if (scopePreset) {
        if (scopePreset) {
          $scope.steps.push(scopePreset);
        }
      }
      mytimeout = $timeout($scope.onTimeout, 1000);
      if ($scope.time > 10) {
        $location.path('/control_panel').replace();
      }
    };

    var mytimeout = $timeout($scope.onTimeout, 1000);

  });
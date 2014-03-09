'use strict';


angular.module('indigitusMarketingApp').controller('StartInstanceCtrl', function($scope, $http, $location, $timeout, socket, sharedProperties) {

	$scope.steps = [];
	$scope.timeLeft = 60;
	$scope.percentage = 0;

	var timeLeft = 60000;
	var decreaseTimeLeft = function(){
		timeLeft -= 100;	
		$scope.timeLeft = Math.floor(timeLeft / 100) / 10;
		if(Math.round($scope.timeLeft) == $scope.timeLeft) { $scope.timeLeft += '.0'; }
		if(timeLeft > 0){
			$timeout(decreaseTimeLeft, 100);
		}
	};
	$timeout(decreaseTimeLeft, 100);
	
	socket.on('instance.step', function(data) {
		$scope.$apply(function(){
			$scope.steps.push(data.line);
			$scope.percentage = data.percentage;
		});
	});

	socket.on('instance.ready', function(data) {

		if (data.host !== null) {
			sharedProperties.set('host', data.host);
		}

		console.log('ON INSTANCE READY', data.ip);

		$scope.$apply(function(){
			$location.path('/control_panel').replace();
		});

	});

	socket.on('instance.error', function(data) {
		console.error(data);
	});


	socket.emit('instance.start');

});





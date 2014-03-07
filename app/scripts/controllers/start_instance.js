'use strict';


angular.module('indigitusMarketingApp').controller('StartInstanceCtrl', function($scope, $http, $location, $timeout, socket) {

	$scope.steps = [];
	$scope.timeLeft = 60;

	socket.emit('instance.start');
	
	$timeout(function(){
		console.log('CALLED');
		$location.path('/control_panel').replace();
	}, 1000);

	socket.on('instance.step', function(data) {
		console.log('DAT STEP');
		console.log(data.step);
		$scope.steps.push(data.step);
	});

	socket.on('instance.ready', function(data) {
		console.log('ON INSTANCE READY');
		$location.path('/control_panel').replace();
	});

	socket.on('instance.error', function(data) {
		console.error(data);
	});

});





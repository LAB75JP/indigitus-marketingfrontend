'use strict';


angular.module('indigitusMarketingApp').controller('StartInstanceCtrl', function($scope, $http, $location, $timeout, socket, sharedProperties) {

	$scope.steps = [];
	$scope.timeLeft = 60;

	socket.emit('instance.start');
	
	var decreaseTimer = function(){
		$scope.timeLeft--;
		$timeout(decreaseTimer, 1000);
	};
	
	$timeout(decreaseTimer, 1000)
	
	socket.on('instance.step', function(data) {
		$scope.$apply(function(){
			$scope.steps.push(data.line);
		});
	});
	
	socket.on('instance.public_ip', function(data){
		sharedProperties.set('publicIp', data.publicIp);
		console.log(sharedProperties.get('publicIp'));
	});

	socket.on('instance.ready', function(data) {
		console.log('ON INSTANCE READY');
		$scope.$apply(function(){
			$location.path('/control_panel').replace();
		});
	});

	socket.on('instance.error', function(data) {
		console.error(data);
	});

});





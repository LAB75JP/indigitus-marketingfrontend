'use strict';


angular.module('indigitusMarketingApp').controller('StartInstanceCtrl', function($scope, $http, $location, $timeout, socket, sharedProperties) {

	$scope.steps = [];
	$scope.timeLeft = 60;
	$scope.percentage = 0;

	var stepPresets = [
		'Botting Instance',
		'jdhashgsahdgsahdghasgdsa',
		'dasjkldhsahgdashgdh saghdas',
		'dahdgdsagdsaghagdhsagdh saghdgashjdgas',
		'dahdjsgdgdsagdhasgdhagdh gdasjhdgahdgashjdgsa',
		'dahdhsagdhagdhgdashgdgasjhdgasdh',
		'dakjsidhgaszdgsahdgbahjdgas dashdgsgsgagjh',
		'dasjdksabdjkashdjaskdhsaid zhiuhz89husadasas',
		'dasjdkjsagh dhasgdhsagddga sjhdgasjhasgd',
		'agsbdagdagvjhghjgashdgasuz 6fdasd sad sadsadsadsa',
		'd asd sadsadsadsadsadsa das dsadsasada asdsadsasdasd'
	];
	var stepPresetsCounter = 0;
	var percentagePerTick = 100 / $scope.timeLeft;



	socket.on('instance.step', function(data) {
		$scope.$apply(function(){
			$scope.steps.push(data.line);
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





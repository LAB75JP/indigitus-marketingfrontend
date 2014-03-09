'use strict';


angular.module('indigitusMarketingApp').controller('StartInstanceCtrl', function($scope, $http, $location, $timeout, socket, sharedProperties) {
	
	var test = true;
	
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
	if(test){
		
		var addTestStep = function(){
			
			$scope.steps.push(stepPresets[stepPresetsCounter++]);
			if(stepPresetsCounter < stepPresets.length){
				$timeout(addTestStep, 1000);		
			}
			if($scope.percentage < 100){
				$scope.percentage += Math.floor(percentagePerTick + Math.random() * 10);
			}
		};
		
		$timeout(addTestStep, 1000);
		
	}
	
	if(!test){
		socket.emit('instance.start');
	}
	
	
	
	
	
	var decreaseTimer = function(){
		if($scope.timeLeft > 0){
			$scope.timeLeft--;
			$timeout(decreaseTimer, 1000);
		}
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





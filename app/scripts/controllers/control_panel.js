'use strict';


angular.module('indigitusMarketingApp').controller('ControlPanelCtrl', function($scope, $http, $location, $timeout, socket, sharedProperties, leafletData) {

	$scope.host = sharedProperties.get('host');
	//$scope.host = '127.0.0.1';
	//$scope.host='185.39.230.47';

	if (!$scope.host) {
		$location.path('/').replace();
	}



	$scope.startupTime = sharedProperties.get('startupTime') / 1000;

	/*
	 * PING
	 */
	$scope.timeLeft = '30:00';
	var timeLeft = 60 * 30;
	var decreaseTimeLeft = function() {
		timeLeft -= 1;
		var seconds = timeLeft % 60 + '';
		var secondsDisplay = (seconds.length < 2) ? '0' + seconds : seconds;
		$scope.timeLeft = Math.floor(timeLeft / 60) + ':' + secondsDisplay;
		if (timeLeft > 0) {
			$timeout(decreaseTimeLeft, 1000);
		} else {
			socket.emit('instance.delete', {
				host: $scope.host
			});
			$scope.$apply(function() {
				$location.path('/').replace();
			});
		}
	};
	$timeout(decreaseTimeLeft, 1000);

	$scope.pingLines = [];
	$scope.pingsActive = false;
	$scope.pingsAverage = 0;
	$scope.pingsItem = 0;
	$scope.pingsData = [{
		key: 'Pings',
		values: []
	}];
	$scope.markers = {};
	$scope.pingList = [];

	socket.on('ping', function(data) {

		if (data === null) return;

		$scope.$apply(function() {

			if (data.sequence > 0) {

				var total = 1;
				var values = $scope.pingsData[0].values;
				for (var v = 0, vl = values.length; v < vl; v++) {
					total += values[v][1];
				}

				$scope.pingsAverage = (total / $scope.pingsData[0].values.length).toFixed(2);
				$scope.pingsData[0].values[$scope.pingsItem] = [data.sequence, data.time];
				$scope.pingList[data.sequence] = data;
				$scope.pingLines.push(data.line);
				$scope.pingsItem++;

			} else {

				$scope.pingsActive = false;
				$scope.pingsItem = 0;

			}

		});

	});

	$scope.pingTooltip = function(label, index) {
		return 'google.com ' + ' <strong>' + $scope.pingList[index].time + 'ms</strong>';
	};


	$scope.ping = function() {

		$scope.hidePing = false;
		if ($scope.pingsActive === true) {
			return false;
		}

		$scope.pingsActive = true;
		$scope.pingsItem = 0;
		$scope.pingsData[0].values = [];
		$scope.pingLines = [];
		$scope.pingList = [];
		socket.emit('ping', {
			host: $scope.host,
			target: 'google.com',
			start: Date.now()
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

	$scope.tracerouteTooltip = function(label, index) {
		return 'Host: <strong>' + $scope.tracerouteHosts[index] + '</strong>';
	};

	$scope.lastLocation = null;
	$scope.addMarker = function(sequence, host, location) {
		console.log($scope.host);
		var hack = $scope.host.split('.');
		var isInstance = (host.indexOf(hack.splice(0, 2).join('.')) > -1);
		var icon = isInstance ? 'images/indigitus_setup.png' : 'images/setup.png';

		for (var key in $scope.markers) {

			var marker = $scope.markers[key];
			if (marker.lat === parseFloat(location.latitude) && marker.lng === parseFloat(location.longitude)) {
				return;
			}

		}


		$scope.markers['m' + new Date().getTime()] = {
			lat: parseFloat(location.latitude),
			lng: parseFloat(location.longitude),
			message: host,
			icon: {
				iconUrl: icon,
				iconSize: [25, 25],
				iconAnchor: [10, 10],
				popupAnchor: [0, 0],
				shadowAnchor: [0, 0],
				shadowUrl: false
			}
		};

	};

	$scope.paths = {
		p1: {
			color: '#000',
			weight: 2,
			latlngs: [{
				lat: 53.55857,
				lng: 9.9278215
			}, {
				lat: 52.5075419,
				lng: 13.4261419
			}]
		}
	};

	$scope.addPath = function(sequence, host, location) {
		var latlngs = $scope.paths.p1.latlngs;

		for (var i = 0; i < latlngs.length; i++) {

			var item = latlngs[i];
			if (
				latlngs[i] && latlngs[i].lat === location.latitude && latlngs[i].lng === location.longitude
			) {
				return;
			}

		}

	};

	$scope.pathItems = 0;
	$scope.updatePath = function() {

		var latlngs = $scope.paths.p1.latlngs;
		for (var i = 1; i <= $scope.tracerouteList.length; i++) {

			var traceroute = $scope.tracerouteList[i];
			var add = false;
			if (traceroute && traceroute.location) {
				var add = true;
				for (var y in latlngs) {
					if (latlngs[y]) {
						if (
							latlngs[y].lat === traceroute.location.latitude && latlngs[y].lng ===
							traceroute.location.longitude
						) {
							add = false;
							break;
						}
					}
				}
			}

			if (add) {
				$scope.paths.p1.latlngs[$scope.pathItems++] = {
					lat: traceroute.location.latitude,
					lng: traceroute.location.longitude
				};
			}

		}

	};

	socket.on('traceroute.stop', function() {
		$scope.tracerouteActive = false;
		setTimeout(function() {
			$timeout(function() {
				$scope.center = {
					lat: 46.5153739,
					lng: 8.4549229,
					zoom: 2
				};
			}, intervalCounter * 2000);
		}, 2000);
	});

	// TODO: Order Traceroute by sequence!
	$scope.tracerouteHosts = {};
	$scope.tracerouteLines = [];
	$scope.tracerouteList = [];
	var setCenter = false;
	var intervalCounter = 0;
	socket.on('traceroute', function(data) {

		if (data === null) return false;

		$scope.$apply(function() {

			if (data.sequence > 0) {

				$scope.tracerouteHosts[data.sequence] = data.host;
				$scope.tracerouteItem++;
				$scope.tracerouteLines[data.sequence] = data.line;
				$scope.tracerouteData[0].values[data.sequence] = [data.sequence, data.time];
				$scope.tracerouteList[data.sequence] = data;

				for (var i = 0; i < data.sequence; i++) {

					if (!$scope.tracerouteData[0].values[i]) {
						$scope.tracerouteData[0].values[i] = [i + 1, 0];
					}

					if (!$scope.tracerouteList[i + 1]) {
						$scope.tracerouteList[i + 1] = null;
					}

					if (!$scope.tracerouteLines[i]) {
						$scope.tracerouteLines[i] = '';
					}

				}

				if (data.location) {
					if (!setCenter) {
						(function(location) {
							$timeout(function() {
								var time = (data.time) ? ' ' + data.time + 'ms' : '';
								var label = data.host + time;
								$scope.addMarker(data.sequence, label, data.location);
								$scope.updatePath();
								$scope.center = {
									lat: data.location.latitude,
									lng: data.location.longitude,
									zoom: 5
								};
							}, intervalCounter++ * 2000);
						})(data.location);
					}

				}

			}

		});

	});


	$scope.deletingInstance = false;
	$scope.stopInstance = function() {
		$scope.deletingInstance = true;
		socket.emit('instance.delete', {
			host: $scope.host
		});
	};

	socket.on('instance.deleted', function() {
		$scope.$apply(function() {
			$location.path('/').replace();
		});
	});

	socket.on('instance.location', function(location) {
		$scope.addMarker(0, $scope.host, location);
	});

	$scope.traceroute = function() {

		intervalCounter = 0;
		$scope.hideTraceroute = false;
		$scope.paths = {
			p1: {
				color: '#000',
				weight: 2,
				latlngs: []
			}
		};

		$scope.markers = {};
		$scope.pathItems = 0;
		if ($scope.tracerouteActive === true) return false;
		$scope.lastLocation = null;
		$scope.tracerouteHosts = [];
		$scope.tracerouteItem = 0;
		$scope.tracerouteActive = true;
		$scope.tracerouteLines = [];
		socket.emit('traceroute', {
			host: $scope.host,
			target: '173.194.116.41',
			start: Date.now()
		});
		socket.emit('instance.get_location', {
			host: $scope.host
		});

	};



	/*
	 * UPLOAD
	 */

	$scope.uploadPercentage = 0;
	$scope.uploadTimeDisplay = 0;

	var uploadTime = 0;
	var uploadUpdateTimer = function() {

		uploadTime += 100;
		var elapsed = ((uploadTime / 100) / 10).toFixed(2);
		$scope.uploadTimeDisplay = elapsed;
		if ($scope.uploadPercentage <= 98) {
			$timeout(uploadUpdateTimer, 100);
		} else {
			$scope.uploadPercentage = 100;
		}

	};

	socket.on('upload', function(data) {
		if (data === null) return;
		$scope.$apply(function() {
			$scope.uploadPercentage = data.percentage;
		});
	});

	$scope.upload = function() {

		$scope.hideUpload = false;

		uploadTime = 0;
		$scope.uploadTimeDisplay = 0;
		$scope.uploadPercentage = 0;

		socket.emit('upload', {
			host: $scope.host,
			start: Date.now()
		});

		$timeout(uploadUpdateTimer, 100);

	};



	/*
	 * DOWNLOAD
	 */

	$scope.downloadPercentage = 0;
	$scope.downloadTimeDisplay = 0;

	var downloadTime = 0;
	var downloadUpdateTimer = function() {

		downloadTime += 100;

		var elapsed = ((downloadTime / 100) / 10).toFixed(2);
		$scope.downloadTimeDisplay = elapsed;

		if ($scope.downloadPercentage <= 98) {
			$timeout(downloadUpdateTimer, 100);
		} else {
			$scope.downloadPercentage = 100;
		}

	};

	socket.on('download', function(data) {
		$('.progress-striped').addClass('active');
		if (data === null) return;
		$scope.$apply(function() {
			$scope.downloadPercentage = data.percentage;
			if ($scope.downloadPercentage == 100) {
				$('.progress-striped').removeClass('active');
			}
		});
	});

	$scope.download = function() {

		$scope.hideDownload = false;

		downloadTime = 0;
		$scope.downloadTimeDisplay = 0;
		$scope.downloadPercentage = 0;

		socket.emit('download', {
			host: $scope.host,
			start: Date.now()
		});

		$timeout(downloadUpdateTimer, 100);

	};



	$scope.barColor = function() {
		return '#4d4d70';
	};

	$scope.center = {
		lat: 46.5153739,
		lng: 8.4549229,
		zoom: 2
	};

	$scope.defaults = {
		tileLayer: "https://{s}.tiles.mapbox.com/v3/lab75.hfmjfap1/{z}/{x}/{y}.png",
		scrollWheelZoom: false,
		tileLayerOptions: {
			opacity: 0.9,
			detectRetina: true,
			reuseTiles: true,
		}
	};



	/*
	 * TERMINAL
	 */

	var _terminal = null;

	var AVAILABLE_COMMANDS = [
		'ls',
		'ps',
		'netstat',
		'ping',
		'date',
		'uptime'
	];

	socket.on('instance.command_output', function(data) {

		if (_terminal !== null) {

			if (typeof data.line === 'string') {
				_terminal.echo(data.line);
			}

			if (data.exit === true) {
				_terminal.resume();
			}

		}

	});

	socket.on('instance.command_error', function(data) {

		if (_terminal !== null) {

			if (typeof data.error === 'string') {
				_terminal.error(data.error);
			}

			_terminal.resume();

		}

	});

	$scope.onTerminalInput = function(command, term) {

		if (_terminal === null) {
			_terminal = term;
		}

		if (command === 'help') {

			_terminal.echo('\n' + AVAILABLE_COMMANDS.join('\n') + '\n');
			_terminal.resume();

			return;

		} else {

			socket.emit('instance.command', {
				host: $scope.host,
				command: command
			});

			_terminal.pause();

		}

	};


	$scope.hideTerminalRow = false;
	$scope.hideUpload = true;
	$scope.hideDownload = true;
	$scope.hidePing = true;
	$scope.hideTerminal = true;
	$scope.hideTraceroute = true;
	// Test Path
	$scope.hideTraceroute = true;
	$scope.hidePingOutput = true;
	$scope.hideTracerouteOutput = true;

});
'use strict';


angular.module('indigitusMarketingApp').controller('ControlPanelCtrl', function($scope, $http, $location, $timeout, socket, sharedProperties, leafletData) {

	$scope.host = sharedProperties.get('host');
	//$scope.host = '127.0.0.1';


	/*
	 * PING
	 */

	$scope.pingLines = [];
	$scope.pingsActive = false;
	$scope.pingsAverage = 0;
	$scope.pingsItem = 0;
	$scope.pingsData = [{
		key: 'Pings',
		values: []
	}];
	$scope.markers  = {};
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

		for (var key in $scope.markers) {

			var marker = $scope.markers[key];
			if (marker.lat === parseFloat(location.latitude) && marker.lng === parseFloat(location.longitude)) {
				console.log('RETURN');
				return;
			}

		}

		$scope.markers['m' + sequence] = {
			lat: parseFloat(location.latitude),
			lng: parseFloat(location.longitude),
			message: host,
			icon: {
				iconUrl: 'images/setup.png',
				iconSize: [25, 25],
				iconAnchor: [5, 10],
				popupAnchor: [0, 0],
				shadowSize: [0, 0],
				shadowAnchor: [0, 0]
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
			},
			{
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
				   latlngs[i]
				&& latlngs[i].lat === location.latitude
				&& latlngs[i].lng === location.longitude
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

	// TODO: Order Traceroute by sequence!
	$scope.tracerouteHosts = {};
	$scope.tracerouteLines = [];
	$scope.tracerouteList = [];
	var setCenter = false;
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
					if(!setCenter){
						$scope.center = {
							lat: data.location.latitude,
							lng: data.location.longitude,
							zoom: 10
						};
					}
					var time = (data.time) ? ' ' + data.time + 'ms' : '';
					var label = data.host + time;
					$scope.addMarker(data.sequence, label, data.location);
					//$scope.updatePath();
				}

			}

		});

	});
	
	
	$scope.deletingInstance = false;
	$scope.stopInstance = function(){
		$scope.deletingInstance = true;
		socket.emit('instance.delete', {host: $scope.host});
	};
	
	socket.on('instance.deleted', function(){
		console.log('INSTANCE DELETED');
		$scope.$apply(function(){
			$location.path('/').replace();
		});
		console.log('INSTANCE DELETED');
		
	});

	$scope.traceroute = function () {
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
			host:   $scope.host,
			target: '173.194.116.41',
			start:  Date.now()
		});
		

		$timeout(function(){
			
			leafletData.getMap().then(function(map){
				
				map.invalidateSize(false);
			})
			.catch(function(){
				console.log('DID NOT GET MAP');
			})
			
		}, 3000);
			

	};



	/*
	 * UPLOAD
	 */

	$scope.uploadPercentage = 0;
	$scope.uploadTimeDisplay = 0;

	var uploadTime = 0;
	var uploadUpdateTimer = function () {

		uploadTime += 100;
		var elapsed = ((uploadTime / 100) / 10).toFixed(2);
		$scope.uploadTimeDisplay = elapsed;
		if ($scope.uploadPercentage <= 98) {
			$timeout(uploadUpdateTimer, 100);
		} else {
			$scope.uploadPercentage = 100;
		}

	};

	socket.on('upload', function (data) {
		if (data === null) return;
		$scope.$apply(function () {
			$scope.uploadPercentage = data.percentage;
		});
	});

	$scope.upload = function () {

		$scope.hideUpload = false;

		uploadTime = 0;
		$scope.uploadTimeDisplay = 0;
		$scope.uploadPercentage = 0;

		socket.emit('upload', {
			host:  $scope.host,
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
	var downloadUpdateTimer = function () {

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
		if (data === null) return;
		$scope.$apply(function () {
			$scope.downloadPercentage = data.percentage;
		});
	});

	$scope.download = function () {

		$scope.hideDownload = false;

		downloadTime = 0;
		$scope.downloadTimeDisplay = 0;
		$scope.downloadPercentage = 0;

		socket.emit('download', {
			host:  $scope.host,
			start: Date.now()
		});

		$timeout(downloadUpdateTimer, 100);

	};



	$scope.barColor = function () {
		return '#4d4d70';
	};

	$scope.center = {
		lat: 7.79,
		lng: 21.28,
		zoom: 2
	};

	$scope.defaults = {
		tileLayer: "https://{s}.tiles.mapbox.com/v3/lab75.hfmjfap1/{z}/{x}/{y}.png",
		scrollWheelZoom: false,
		 tileLayerOptions: {
			opacity: 0.9,
			detectRetina: false,
			reuseTiles: true,
		}
	};



	/*
	 * TERMINAL
	 */

    var terminal = null;
	socket.on('instance.command_output', function(data) {
    	terminal.pause();
    	if (data.exit) {
      		terminal.resume();
    	}
    	if (data.code === 127) {
      		terminal.error('type "help" for available commands');
    	}
    	if (data.output) {
      		terminal.echo(data.output);
    	}
    	terminal.resume();
  	});

  	$scope.onTerminalInput = function(command, term) {
    	terminal = term;
    	if (command === 'help') {
      		var sep = '\n';
      		term.echo(sep + sep + $scope.availableCommands.join(sep) + sep);
      		return;
    	} else {
      		socket.emit('instance.command', {
        		host: $scope.host,
        		command: command
      		});
      		term.pause();
    	}
  	};
	
    
	$scope.hideUpload = true;
    $scope.hideTerminalRow = true;
	$scope.hideTerminal = true;
	$scope.hideUpload = true;
	$scope.hideDownload = true;
	$scope.hidePing = true;
	$scope.hideTraceroute = true;
	$scope.hidePingOutput = true;
	$scope.hideTracerouteOutput = true;

});

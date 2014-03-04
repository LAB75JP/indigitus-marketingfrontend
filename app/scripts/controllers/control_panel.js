/*global angular, console*/

angular.module('indigitusMarketingApp')
    .controller('ControlPanelCtrl', function ($scope, $http, $location, $timeout, socket) {
        'use strict';

        // TODO: Update instanceIp via REST API calls
        $scope.instanceIp = '54.72.38.49';



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


        socket.on('ping', function (data) {
            if (data === null) {
                return;
            }
            $scope.$apply(function () {
                if (data.sequence > 0) {
                    var v,
                        v1,
                        vl,
                        total = 1,
                        values = $scope.pingsData[0].values;
                    for (v = 0, vl = values.length; v < vl; v++) {
                        total += values[v][1];
                    }
                    $scope.pingsAverage = (total / $scope.pingsData[0].values.length).toFixed(2);
                    $scope.pingsData[0].values[$scope.pingsItem] = [data.sequence, data.time];
                    $scope.pingLines.push(data.line);
                    $scope.pingsItem++;
                } else {
                    $scope.pingsActive = false;
                    $scope.pingsItem = 0;
                }
            });

        });

        $scope.ping = function () {
            if ($scope.pingsActive === true) {return false; }
            $scope.pingsActive = true;
            $scope.pingsItem = 0;
            $scope.pingsData[0].values = [];
            $scope.pingLines = [];
            socket.emit('ping', {
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

        $scope.tracerouteTooltip = function (label, index) {
            return 'Host: <strong>' + $scope.tracerouteHosts[index] + '</strong>';
        };

        $scope.lastLocation = null;
        $scope.addMarker = function (sequence, host, location) {
            console.log('SEQUENCE', sequence);
            console.log('HOST', host);
            console.log('LOCATION', location);
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
                latlngs: []
            }
        };
        $scope.addPath = function (sequence, host, location) {
            var latlngs = $scope.paths.p1.latlngs;

            for(var i = 0; i < latlngs.length; i++){
                if(latlngs[i]){
                    if(latlngs[i].lat === location.latitude && latlngs[i].lng === location.longitude){
                        return;
                    }
                }
            }

            $scope.paths.p1.latlngs[sequence] = {
               lat: location.latitude,
               lng: location.longitude
            };

        };
        // TODO: Order Traceroute by sequence!
        $scope.tracerouteHosts = {};
        $scope.tracerouteLines = [];
        socket.on('traceroute', function (data) {
            console.log('TRACEROUTEDATA', data);
            if (data === null) return false;
            $scope.$apply(function () {
                if (data.sequence > 0) {

                    $scope.tracerouteHosts[data.sequence] = data.host;
                    $scope.tracerouteData[0].values[$scope.tracerouteItem] = [data.sequence, data.time];
                    $scope.tracerouteItem++;
                    $scope.tracerouteLines.push(data.line);

                    if (data.location) {
                        var time = (data.time) ? ' ' + data.time + 'ms':'';
                        var label = data.host + time;
                        $scope.addMarker(data.sequence, label, data.location);
                        $scope.addPath(data.sequence, data.host, data.location);
                    }

                }
            });
        });

        socket.on('traceroute.stop', function(){
            $scope.tracerouteActive = false;
            $scope.tracerouteItem = 0;
        });

        $scope.traceroute = function () {
            $scope.paths = {
                p1: {
                    color: '#000',
                    weight: 2,
                    latlngs: []
                }
            };
            $scope.markers = {};
            if ($scope.tracerouteActive === true) return false;
            $scope.lastLocation = null;
            $scope.tracerouteHosts = [];
            $scope.tracerouteItem = 0;
            $scope.tracerouteActive = true;
            $scope.tracerouteLines = [];
            socket.emit('traceroute', {
                target: 'facebook.com',
                start: Date.now()
            });
        };



        /*
         * DOWNLOAD
         */

        $scope.downloadPercentage = 0;

        socket.on('download', function (data) {
            if (data === null) return;
            $scope.$apply(function () {
                $scope.downloadPercentage = data.percentage;
            });
        });

        $scope.download = function () {
            socket.emit('download', {
                start: Date.now()
            });
        };


        $scope.barColor = function () {
            return '#00cc00';
        };

        $scope.colorFunction = function () {
            return '#000';
        };

        $scope.upload = function () {};
        $scope.command = '';
        $scope.commands = [];
        $scope.terminalLines = [];
        $scope.availableCommands = [
          'You have a limited set of commands available for testing out the instance:',
          'ls: Description',
          'ping: Description',
          'traceroute: Description'
        ];


        var terminal = null;

        socket.on('instance.command_output', function (data) {
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

        $scope.onTerminalInput = function (command, term) {
            terminal = term;
            if (command === 'help') {
                var sep = '\n';
                term.echo(sep + sep + $scope.availableCommands.join(sep) + sep);
                return;
            } else {
                socket.emit('instance.command', {
                    command: command
                });
                term.pause();
            }
        };

        $scope.center = {
            lat: 48,
            lng: 4,
            zoom: 4
        };

        $scope.defaults = {
            tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
        };

        $scope.markers = {};


    });

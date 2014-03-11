'use strict';

angular.module('indigitusMarketingApp')
    .controller('LandingPageCtrl', function ($scope, $http, $location, vcRecaptchaService, socket) {
        
        $scope.solvingCaptcha = false;
        
        $scope.hideCaptchaForm = true;

        $scope.center= {
            lat: 47.184371,
            lng: 8.5177285,
            zoom: 4
        };
        
        $scope.markers = {
            m1: {
                lat: 47.184371,
                lng: 8.5177285,
                icon: {
                    iconUrl: 'images/marker.png',
					iconAnchor: [5, 0],
					iconSize: [20, 20],
					shadowSize: [0, 0],
					popupAnchor: [0,-15]
				},
				message: "<strong>Indigitus AG</strong><br />Lindenstrasse 4<br />CH-6340 Baar",
                focus: true
            }
        };
        $scope.defaults = {
            tileLayer: "https://{s}.tiles.mapbox.com/v3/lab75.hfmjfap1/{z}/{x}/{y}.png",
            scrollWheelZoom: false
        };

        var scrollTo = function (target) {
            var destination = $(target).offset().top;
            $('html:not(:animated),body:not(:animated)').animate({
                scrollTop: destination - 15
            }, 500);
            return false;
        };

        $scope.alerts = [];

        $scope.scrollToDemo = function () {
            scrollTo('#demo');
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
        
		$scope.reloadCaptcha = function(){
			Recaptcha.reload()  
        };
        
        socket.on('captcha.invalid', function(data){
            console.log('CAPTCHA INVALID');
            if (data.err) {
                $scope.alerts.push({
                    type: 'danger',
                    msg: 'Incorrect Captcha, please try again!'
                });
                vcRecaptchaService.reload();
                $scope.solvingCaptcha = false;
            }
        });

        socket.on('captcha.valid', function(data){
            console.log('CAPTCHA VALID');
            $scope.$apply(function(){
                $location.path('/start_instance').replace();
            });
        });

        $scope.checkCaptcha = function () {
            $scope.solvingCaptcha = true;
            $scope.alerts = [];

            var data = vcRecaptchaService.data();

            if (data.response.length === 0) {
                $scope.alerts.push({
                    type: 'danger',
                    msg: 'Please answer the captcha!'
                });
                $scope.solvingCaptcha = false;
                return;
            }
            
            socket.emit('captcha.validate', vcRecaptchaService.data() );

        };

    });

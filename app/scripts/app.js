'use strict';

angular.module('indigitusMarketingApp', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngAnimate',
	'ui.bootstrap',
	'vcRecaptcha',
	'nvd3ChartDirectives',
    'leaflet-directive'
]).config(function ($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'partials/landing_page',
			controller: 'LandingPageCtrl'
		})
		.when('/start_instance', {
			templateUrl: 'partials/start_instance',
			controller: 'StartInstanceCtrl'
		})
		.when('/control_panel', {
			templateUrl: 'partials/control_panel',
			controller: 'ControlPanelCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(false);

});

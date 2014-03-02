'use strict';


(function() {

	var url     = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
	var _socket = io.connect(url);

	angular.module('indigitusMarketingApp').factory('socket', function($rootScope) {
		return _socket;
	});

})();

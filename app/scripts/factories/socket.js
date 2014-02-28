'use strict';

angular.module('indigitusMarketingApp').factory('socket', function($rootScope) {

	var _socket = null;

	var api = {

		connect: function() {

			var url = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
			_socket = io.connect(url);

		},

		on: function(event, callback, scope) {

			_socket.on(event, function() {
				var args = [].slice.call(arguments);
				callback.apply(scope, args);
			});

		},

		emit: function(event, data, callback, scope) {

			_socket.emit(event, data, function() {
				var args = [].slice.call(arguments);
				callback.apply(scope, args);
			});

		}

	};


	return api;

});


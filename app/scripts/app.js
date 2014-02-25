'use strict';

angular.module('indigitusDemonstrationApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  });


$(document).ready(function () {
  if ($('#term')) {
    $('#term').terminal(function (command, term) {
      if (command !== '') {
        try {
          var result = window.eval(command);
          if (result !== undefined) {
            term.echo(new String(result));
          }
        } catch (e) {
          term.error(new String(e));
        }
      } else {
        term.echo('');
      }
    }, {
      greetings: 'Javascript Interpreter',
      name: 'js_demo',
      height: 200,
      prompt: 'js> '
    });
  }
});
'use strict';

var full = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
var socket = io.connect(full);

angular.module('indigitusMarketingApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.bootstrap',
  'vcRecaptcha',
  'nvd3ChartDirectives'
])
  .config(function($routeProvider, $locationProvider) {
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


//$(document).ready(function () {
//  if ($('#term').length) {
//    $('#term').terminal(function (command, term) {
//      if (command !== '') {
//        try {
//          var result = window.eval(command);
//          if (result !== undefined) {
//            term.echo(new String(result));
//          }
//        } catch (e) {
//          term.error(new String(e));
//        }
//      } else {
//        term.echo('');
//      }
//    }, {
//      greetings: 'Javascript Interpreter',
//      name: 'js_demo',
//      height: 200,
//      prompt: 'js> '
//    });
//  }
//});
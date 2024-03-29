/*global $*/
'use strict';
angular.module('indigitusMarketingApp')
  .directive('terminal', function() {
    return {
      scope: true,
      link: function(scope, element, attrs) {
        $(element).terminal(scope.$eval(attrs.cb), {
          greetings: attrs.greetings,
          name: 'js_demo',
          height: attrs.height,
          width: attrs.width,
          prompt: attrs.prompt
        });
      }
    };
  });
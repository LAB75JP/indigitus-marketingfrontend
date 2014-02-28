'use strict';

angular.module('indigitusMarketingApp')
  .controller('LandingPageCtrl', function ($scope, $http, $location, vcRecaptchaService) {

    var scrollTo = function (target) {
      var destination = $(target).offset().top;
      $('html:not(:animated),body:not(:animated)').animate({
        scrollTop: destination - 15
      }, 500);
      return false;
    };

    $scope.alerts = [];

    $scope.scrollToDemo = function () {
      scrollTo('#demo-teaser');

    };

    $scope.closeAlert = function (index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.checkCaptcha = function () {

      $scope.alerts = [];

      var data = vcRecaptchaService.data();


      if (data.response.length === 0) {
        $scope.alerts.push({
          type: 'danger',
          msg: 'Please answer the captcha!'
        });
        return;
      }

      $http({
        method: 'POST',
        url: '/check_recaptcha',
        data: vcRecaptchaService.data()
      }).success(function (data) {
        if (data.err) {
          $scope.alerts.push({
            type: 'danger',
            msg: 'Incorrect Captcha, please try again!'
          });
          vcRecaptchaService.reload();
        }
        if (data.success) {
          console.log('IS CORRECT');
          $location.path('/start_instance').replace();
          return;
        }
        vcRecaptchaService.reload();
      }).error(function (data) {
        vcRecaptchaService.reload();
        $scope.alerts.push({
          type: 'danger',
          msg: data.err
        });

      });


    };

  });
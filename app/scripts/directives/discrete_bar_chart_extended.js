angular
  .module('indigitusMarketingApp')
  .directive('extendedNvd3DiscreteBarChart', function () {
    "use strict";
    return {
      restrict: 'E',
      require: '^nvd3DiscreteBarChart',
      link: function ($scope, $element, $attributes, nvd3DiscreteBarChart) {
        $scope.d3Call = function (data, chart) {
          var svg = d3.select('#' + $scope.id + ' svg')
            .datum(data);

          var path = svg.selectAll('path');
          path.data(data)
            .transition()
            .ease("linear")
            .duration(500)

          return svg.transition()
            .duration(500)
            .call(chart);

        }
      }
    }


  });
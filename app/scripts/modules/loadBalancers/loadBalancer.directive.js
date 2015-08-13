'use strict';

let angular = require('angular');

require('./loadBalancer/loadBalancer.html');

module.exports = angular.module('spinnaker.loadBalancer.directive', [
])
  .directive('loadBalancer', function ($rootScope, $timeout, LoadBalancerFilterModel) {
    return {
      restrict: 'E',
      templateUrl: require('./loadBalancer/loadBalancer.html'),
      scope: {
        loadBalancer: '=',
        serverGroups: '=',
      },
      link: function(scope, el) {
        var base = el.parent().inheritedData('$uiView').state;
        var loadBalancer = scope.loadBalancer;

        scope.sortFilter = LoadBalancerFilterModel.sortFilter;
        scope.$state = $rootScope.$state;

        scope.waypoint = [loadBalancer.account, loadBalancer.region, loadBalancer.name].join(':');

        scope.loadDetails = function(event) {
          $timeout(function() {
            var loadBalancer = scope.loadBalancer;
            // anything handled by ui-sref or actual links should be ignored
            if (event.isDefaultPrevented() || (event.originalEvent && (event.originalEvent.defaultPrevented || event.originalEvent.target.href))) {
              return;
            }
            var params = {
              region: loadBalancer.region,
              accountId: loadBalancer.account,
              name: loadBalancer.name,
              vpcId: loadBalancer.vpcId,
              provider: loadBalancer.provider,
            };
            // also stolen from uiSref directive
            scope.$state.go('.loadBalancerDetails', params, {relative: base, inherit: true});
          });
        };
      }
    };
  }).name;

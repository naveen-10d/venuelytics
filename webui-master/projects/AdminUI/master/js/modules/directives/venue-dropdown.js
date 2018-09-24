/**=========================================================
 * Module: venue-dropdown.js
 * Init jQuery Vector Map plugin
 =========================================================*/

App.directive('venueDropdown',  ['ContextService','$rootScope','APP_EVENTS', function(contextService, $rootScope, APP_EVENTS){
  'use strict';

  return {
    restrict: 'EA',
    templateUrl: 'app/templates/venue/venue-dropdown.html',
    controller: function($scope, $element) {

      $('#d_filterInput').click(function(e) {
            e.stopPropagation();
      });

      $scope.contextService = contextService;
      $scope.setVenue = function(venueName, venueId) {
        $scope.contextService.setVenue(venueName, venueId);
        $rootScope.$broadcast(APP_EVENTS.venueSelectionChange, {venueName: venueName, venueId: venueId});
      };
    }
  };

}]);
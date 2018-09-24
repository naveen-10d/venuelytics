/**=========================================================
 * Module: venuestores.js
 *smangipudi
 =========================================================*/
App.controller('NewVenueStoreController', ['$scope', '$state', '$stateParams','RestServiceFactory', 'toaster', 'VenueService', 
  function($scope, $state, $stateParams, RestServiceFactory, toaster, venueService) {
  'use strict';
  
  $scope.init = function() {
    $scope.venueName = venueService.getVenueInfo($stateParams.id, 'name');
  };
  
	$scope.search = function(storeName) {
		var promise = RestServiceFactory.AgencyService().get({search: storeName, type: 'AGENCY'});
		promise.$promise.then(function(data) {
			$scope.stores = data.agencies;
		});
	};

	$scope.doneAction = function() {
		$state.go('app.venues', {id:$stateParams.id});
	};
	
	$scope.addVenueStore = function(store) {
		
		var target = {id: $stateParams.id, agencyId: store.id};
		RestServiceFactory.VenueService().addAgency(target,  function(success){
			var index = $scope.stores.indexOf(store);
			$scope.stores.splice(index, 1);
  	},function(error){
  		if (typeof error.data !== 'undefined') { 
  			toaster.pop('error', "Server Error", error.data.developerMessage);
  		}
  	});
	};

  $scope.init();
}]);
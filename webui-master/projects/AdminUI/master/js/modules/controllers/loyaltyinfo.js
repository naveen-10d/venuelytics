/**=========================================================
 * Module: loyaltyInfo.js
 * smangipudi
 =========================================================*/

App.controller('LoyaltyLevelController', ['$scope', '$state', '$stateParams', 'RestServiceFactory', 'toaster', 'ContextService', 
        function($scope, $state, $stateParams, RestServiceFactory, toaster, contextService) {
  'use strict';
    $scope.venueNumber = contextService.userVenues.selectedVenueNumber;
    if($stateParams.id != 'new') {
	    var promise = RestServiceFactory.LoyaltyService().getLevel({id: $scope.venueNumber, levelId:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
	    },function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	} );
    } else {
        $scope.data ={};
        $scope.data.venueNumber = $scope.venueNumber;
    }
    $scope.update = function(isValid, data) {
    	console.log(data);
    	if (!isValid) {
    		return;
    	}

    	var displayAttributes = data.displayAttributes;
    	data.displayAttributes = JSON.stringify(displayAttributes);
    	data.conditionType = "V";
    	data.venueNumber = $scope.venueNumber;
        var payload = RestServiceFactory.cleansePayload('LoyaltyService', data);
    	var target = {id: data.id};
    	if ($stateParams.id == 'new'){
    		target = {};
    	}
    	RestServiceFactory.LoyaltyService().save(target,payload, function(success){
    		$state.go('app.loyalty');
    	},function(error){
    		if (typeof error.data != 'undefined') { 
    			toaster.pop('error', "Server Error", error.data.developerMessage);
    		}
    	});
    }
}]);
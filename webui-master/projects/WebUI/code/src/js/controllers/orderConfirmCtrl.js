/**
 * @author K.Saravanakumar
 * @date 28-JULY-2017
 */
"use strict";
app.controller('OrderConfirmController', ['$log', '$scope', '$location', 'DataShare', '$rootScope', '$routeParams', 'ngMeta', 'VenueService',
    function ($log, $scope, $location, DataShare, $rootScope, $routeParams, ngMeta, venueService) {

    		$log.log('Inside Order confirm Controller.');

    		var self = $scope;
    		
    		self.venueRefId = function(venue) {
                if (!venue.uniqueName) {
                    return venue.id;
                } else {
                    return venue.uniqueName;
                }
            };

            self.init = function() {
			
				self.venueDetails = venueService.getVenue($routeParams.venueId);
				$rootScope.description = self.venueDetails.description;
				self.selectedCityName = self.venueDetails.city;
				ngMeta.setTag('description', self.venueDetails.description + " Bottle Order Confirmation");
				$rootScope.title = self.venueDetails.venueName+  " Venuelytics - Bottle Services Confirmation";
				ngMeta.setTitle($rootScope.title);
				DataShare.bottleServiceData = {};
                DataShare.tableSelection = '';
                DataShare.selectBottle = '';
                DataShare.editBottle = 'false';
                DataShare.partyServiceData = {};
                DataShare.reserveTableSelection = '';
                DataShare.partyPackageObj = '';
	        	self.backToReservation = function() {
					$rootScope.serviceName = 'BottleService';
	            	$location.url('/cities/' + self.selectedCityName + '/' + self.venueRefId(self.venueDetails) + '/bottle-service');
	        	};
	        };

	       self.init();

    }]);

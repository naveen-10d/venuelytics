/**=========================================================
 * Module: login_auth.js
 * smangipudi
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec
 =========================================================*/
 
App.service('ContextService',['RestServiceFactory', '$rootScope', 'AUTH_EVENTS',
	function( RestServiceFactory, $rootScope, AUTH_EVENTS) {
			
	//dev.api.venuelytics.com
	'use strict';
	
	this.serverName = RestServiceFactory.serverName; 
	this.contextName = RestServiceFactory.contextName; 

	this.userVenues = {
        selectedVenueNumber: 0,
        selectedVenueName : "",
        listIsOpen : false,
        available: {}
	};
	

	this.openVenueDropdown = function (selector) {
        $(selector).animate({ scrollTop: 0 }, 'slow', function () {});
    };
    var self = this;
	$rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
		if(typeof $rootScope.$storage.selectedVenueNumber !== 'undefined'){
			self.userVenues.selectedVenueNumber = $rootScope.$storage.selectedVenueNumber;
			self.userVenues.selectedVenueName = $rootScope.$storage.selectedVenueName;
		}
		self.loadVenues();
	});

	this.setVenue = function (venueName, venueNumber) {
        
        this.userVenues.selectedVenueNumber = venueNumber;
        this.userVenues.selectedVenueName = venueName;
        this.userVenues.listIsOpen = !this.userVenues.listIsOpen;

        $rootScope.$storage.selectedVenueNumber = venueNumber;
      	$rootScope.$storage.selectedVenueName = venueName;
          
    };
    this.loadVenues  = function() {

    	var self = this;	
    	var promise = RestServiceFactory.VenueService().get();
		promise.$promise.then(function(data) {

			self.userVenues.available = [];
			var venue = null;
			var selectedVenueFound = false;
			
			for (var index in data.venues) {
				venue = data.venues[index];
				self.userVenues.available.push({name: venue.venueName, id: venue.id});
				if ($rootScope.$storage.selectedVenueNumber == venue.id){
					$rootScope.$storage.selectedVenueName = venue.venueName;
					selectedVenueFound = true;
				}
			}

			if (selectedVenueFound) {
				self.userVenues.selectedVenueNumber = $rootScope.$storage.selectedVenueNumber;
				self.userVenues.selectedVenueName = $rootScope.$storage.selectedVenueName;
			} else {
				venue = data.venues[0];
				self.userVenues.selectedVenueNumber = venue.id;
				self.userVenues.selectedVenueName = venue.venueName;
				$rootScope.$storage.selectedVenueNumber = venue.id;
				$rootScope.$storage.selectedVenueName = venue.venueName;
			}
		});
    };
    
	return this;
}]);
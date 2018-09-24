"use strict";
app.controller('ChannelsController', ['$rootScope', '$log', '$scope',  '$location', '$routeParams', 'AjaxService', 'ngMeta','VenueService',
    function ($rootScope, $log, $scope, $location, $routeParams, AjaxService, ngMeta, venueService) {

        $log.log('Inside ChannelsController Controller.');

        var self = $scope;

        self.init = function () {
        	AjaxService.getVenues($routeParams.venueId, null, null).then(function (response) {
                self.venueDetails = response;
                self.venueId = self.venueDetails.id;
                venueService.saveVenue($routeParams.venueId, response);
                venueService.saveVenue(self.venueId, response);
                $rootScope.description = self.venueDetails.description;
                self.selectedCity = self.venueDetails.city;
                self.venueName = $rootScope.headerVenueName = self.venueDetails.venueName;
                ngMeta.setTag('description', self.venueDetails.description);
	            $rootScope.title = self.venueDetails.venueName + " - Channel Lineup";
	            ngMeta.setTitle($rootScope.title);
    
            }); 

            AjaxService.getChannels($routeParams.venueId).then(function (response) {
            	self.channels = response.data;
            });
        };

    	self.init(); 
    }
]);
"use strict";
app.controller('NightLifeController', ['$rootScope', '$log', '$scope', '$location', '$routeParams', 'AjaxService', 'ngMeta', 'VenueService',
    function ($rootScope, $log, $scope, $location, $routeParams, AjaxService,  ngMeta, venueService) {

        $log.log('Inside Night Life Controller.');

        var self = $scope;

        self.init = function () {
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description);
            $rootScope.title = self.venueDetails.venueName + " - Nearby Nightlife";
            ngMeta.setTitle($rootScope.title);

            AjaxService.nearBy($routeParams.venueId, 'nightlife').then(function (response) {
                self.listOfNightlife = response.data
            });
            AjaxService.getCategories(self.venueId , 'NightLife', 'NIGHTLIFE').then(function(response) {
                self.nightlifeCategories = response.data;
                self.nightlifeCategories.push({name: "ALL", value: 0});
                self.selectedCategory = self.nightlifeCategories[self.nightlifeCategories.length-1];
            });
          
            
        };
        self.onFilterChanged = function() {
            AjaxService.nearBy($routeParams.venueId, 'nightlife', self.selectedCategory.value).then(function (response) {
                self.listOfNightlife = response.data;
            });
        };
        self.nightlifeRefId = function (nightlife) {
            if (!nightlife.uniqueName) {
                return nightlife.id;
            } else {
                return nightlife.uniqueName;
            }
        }

        self.getNightlifeDetailUrl = function (nightlife) {
            self.selectedCityName = nightlife.city;
            var q = "";
            if ($rootScope.embeddedFlag) {
                q = "?embeded=Y";
            }
            return '/nightlife/' + self.selectedCityName + '/' + self.nightlifeRefId(nightlife) + q;
        }

        self.init();
    }])
"use strict";
app.controller('AttractionsController', ['$rootScope', '$log', '$scope',  '$location', '$routeParams', 'AjaxService', 'ngMeta','VenueService',
    function ($rootScope, $log, $scope, $location, $routeParams, AjaxService, ngMeta, venueService) {

        $log.log('Inside Attractions Controller.');

        var self = $scope;

        self.init = function () {
            self.venueDetails = venueService.getVenue($routeParams.venueId);
            self.venueId = self.venueDetails.id;
            ngMeta.setTag('description', self.venueDetails.description);
            $rootScope.title = self.venueDetails.venueName + " - Nearby Attractions";
            ngMeta.setTitle($rootScope.title);

            AjaxService.nearBy($routeParams.venueId, 'attraction').then(function (response) {
                self.listOfAttractions = response.data
            });
            setTimeout(function() {
                self.getSelectedTab();
            }, 600);
             AjaxService.getCategories(self.venueId , 'attractions', 'ATTRACTION').then(function(response) {
                self.attractionsLists = response.data;
                self.attractionsLists.push({name: "ALL", value: -1});
                self.selectedAttraction = self.attractionsLists[self.attractionsLists.length-1];
            });
           
        };

        self.onFilterChanged = function() {
            AjaxService.nearBy(self.venueId, 'attraction', self.selectedAttraction.value).then(function (response) {
                self.listOfAttractions = response.data;
            });
        };
        self.getSelectedTab = function() {
            $(".service-btn .card").removeClass("tabSelected");
            $("#attractions > .card").addClass("tabSelected");
        };

        self.attractionRefId = function (attraction) {
            if (!attraction.uniqueName) {
                return attraction.id;
            } else {
                return attraction.uniqueName;
            }
        }

        self.getAttractionDetailUrl = function (attraction) {
            self.selectedCityName = attraction.city;
            var q = "";
            if ($rootScope.embeddedFlag) {
                q = "?embeded=Y";
            }
            return '/attraction/' + self.selectedCityName + '/' + self.attractionRefId(attraction) + q;
        }

        self.init();
    }])
/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
 "use strict";
 app.controller('LandingController', ['$scope','$location','$rootScope', 'AjaxService', '$routeParams', 'VenueService',function ( $scope, $location, $rootScope, AjaxService, $routeParams, venueService) {
 		$rootScope.embeddedFlag = true;

 		$scope.actions = [];
 		
 		
 		var self = $scope;
        self.venueImage = '';
        $rootScope.blackTheme = "";
 		$scope.init = function () {
            $scope.getVenue();
 		};

        $scope.populateButtons = function() {
            $scope.addAction('eventListBtn', 'EVENT_CAL', 'Event Calander', 'event_image.png', self.enableEvents);
            $scope.addAction('tableBtn',     'TABLE', 'Table Service', 'table.png', self.enableTableService);
            $scope.addAction('privateBtn',   'CONTEST', 'Contest', 'trophy.png', self.enablePrivateEvent);
            $scope.addAction('bottleBtn',    'KIDS_ZONE', 'Kids Zone', 'vipbox_kidz_zone.png', self.enableBottleService);
            $scope.addAction('foodBtn',      'cities/Fremont/70008/food-service', 'Food Service', 'foods.png', self.enableFood);
            $scope.addAction('drinksBtn',    'cities/Fremont/70008/drink-service', 'Drink Service', 'drink.png', self.enableDrinks);
            $scope.addAction('wineToHomeBtn','cities/Fremont/70008/wine-to-home', 'Wine To Home', 'drink.png', self.wineToHomeButton);
            $scope.addAction('bachelorBtn',  'TICKETING', 'Ticketing', 'vipbox_ticketing.png', self.enableBachelorParty);
            $scope.addAction('guestBtn',     'cities/Fremont/70008/guestList', 'Amenities', 'vipbox_amenities.png', self.enableGuestList);
            $scope.addAction('partyBtn',     'cities/Fremont/70008/party-service', 'Survey', 'vipbox_survey.png', self.enablePartyPackageService);
        }
 		$scope.addAction = function(bgColor,actionUrl, actionName, imageUrl, enabled) {
 			var row = [];
 			if ($scope.actions.length > 0) {
 				var lastRow = $scope.actions[$scope.actions.length-1];
 				if (row.length < 3) {
 					row = lastRow;
 				}
 			}
 			if (row.length === 0) {
 				$scope.actions.push(row);
 			}
 			var action = {};
 			action.bgColor = bgColor;
 			action.actionUrl = actionUrl;
 			action.name = actionName;
 			action.imageUrl = imageUrl;
            action.enabled = enabled;
 			row.push(action);

 		};

        $scope.getVenue = function() {

     		AjaxService.getVenues($routeParams.venueId,null,null).then(function(response) {
                self.detailsOfVenue = response;
                self.venueId = self.detailsOfVenue.id;
                venueService.saveVenue(self.venueId, response);
                $rootScope.description = self.detailsOfVenue.description;
                self.selectedCity = self.detailsOfVenue.city;
                self.venueName =  $rootScope.headerVenueName = self.detailsOfVenue.venueName;
                $rootScope.headerAddress = self.detailsOfVenue.address;
                $rootScope.headerWebsite = self.detailsOfVenue.website;
                if (typeof(self.detailsOfVenue.imageUrls) !== 'undefined' && self.detailsOfVenue.imageUrls.length > 0) {
                	self.venueImage = self.detailsOfVenue.imageUrls[0];
            	}
                AjaxService.getInfo(self.venueId).then(function(response) {
                    venueService.saveVenueInfo(self.venueId, response);
                    self.enableDrinks = response.data["Advance.DrinksService.enable"] === 'Y';
                    self.enableFood = response.data["Advance.FoodRequest.enable"] === 'Y';
                    self.enableBottleService = response.data["Advance.BottleService.enable"] === 'Y';
                    self.enablePrivateEvent = response.data["Advance.BookBanquetHall.enable"] === 'Y';
                    self.enableGuestList = response.data["Advance.GuestList.enable"] === 'Y';
                    self.enableTableService = response.data["Advance.TableService.enable"] === 'Y';
                    self.enableEvents = response.data["Advance.Events.enable"] === 'Y';
                    $rootScope.blackTheme = response.data["ui.service.theme"]  || '';
                    self.populateButtons();
                }); 
            });
        };

 		$scope.init();
}]);
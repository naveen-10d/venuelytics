/**
 * @author Navaneethan
 */
"use strict";
app.controller('GamesTournamentController', ['$log', '$scope', '$http', '$location', 'RestURL', '$routeParams', '$rootScope', 'AjaxService','ngMeta',
    function ($log, $scope, $http, $location, RestURL, $routeParams, $rootScope, AjaxService, ngMeta) {

        var self = $scope;
        $rootScope.selectedTab = 'consumer';
        $rootScope.blackTheme = "";
        self.init = function() {
            AjaxService.getVenues($routeParams.venueId,null,null).then(function(response) {
                    /*jshint maxcomplexity:10 */
                self.detailsOfVenue = response;
                self.selectedCity = $routeParams.cityName;
                self.venueName =    self.detailsOfVenue.venueName;
                self.venueImage = response.imageUrls[0].largeUrl;

                self.initMore();

            });

            
            ngMeta.setTitle("Games and Tournament - Venuelytics");
            ngMeta.setTag('image', 'assets/img/screen2.jpg');
            ngMeta.setTag('description',"View active Games, Wait time and Tournament schedules");
            
            setTimeout(function() {
                self.getSelectedTab();
            }, 600);
        };
        
        self.initMore = function() {
            AjaxService.getInfo(self.venueId).then(function(response) {
                //$rootScope.blackTheme = response.data["ui.service.theme"]  || '';
                //$rootScope.blackTheme = 'blackTheme';
            }); 

            AjaxService.getGames(self.detailsOfVenue.id).then(function(response){
                self.games = response.data;
            });

             AjaxService.getTournament(self.detailsOfVenue.id).then(function(response){
                self.tournaments = response.data;
            });
        };

        self.getSelectedTab = function() {
            $(".service-btn .card").removeClass("tabSelected");
            $("#waittime > .card").addClass("tabSelected");
        };

        self.init();

    }]);
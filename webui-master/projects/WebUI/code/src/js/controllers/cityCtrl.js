/**
 * @author Saravanakumar K
 * @date 18-MAY-2017
 */
"use strict";
app.controller('CityController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', 'AjaxService', 'APP_ARRAYS', '$rootScope', 'APP_LINK','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, AjaxService, APP_ARRAYS, $rootScope, APP_LINK, ngMeta) {

    		$log.log('Inside New City Controller.');
    		
            var self = $scope;
            var nextPageSize = 0;
            var previousPageSize = 0;
            self.next = false;
            self.searchVenue = false;
            $rootScope.showItzfun = true;
            $rootScope.selectedTab = 'consumer';
            $rootScope.blackTheme = "";
            self.gettingLocation = function(lat, long, country) {
                self.loadingBar = true;
                AjaxService.gettingLocation(lat, long, country).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                    $log.info('Success getting cities.');

                    // document.getElementById('loadingCities').style.display = 'none';
                });
            };

            self.getCountry = function (countryObject) {
                self.loadingBar = true;
                self.listOfCities = '';
                self.selectedCountry = countryObject;
                AjaxService.getVenuesByCountry(countryObject.shortName, 0).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
            };

            self.getCity = function (citySearch) {
                self.listOfVenuesByCity = [];
                self.loadingBar = true;
                AjaxService.getVenuesByCity(DataShare.latitude, DataShare.longitude, citySearch).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                    if((self.listOfCities.length > 0) && (self.searchVenue === true)){
                        scrollWin();
                        self.citySearch = citySearch;
                        self.venueSearch = '';
                    }
                    if((self.listOfCities.length < 1) && (self.searchVenue === true)) {
                        self.getVenueBySearch(citySearch);
                        self.venueSearch = citySearch;
                        self.citySearch = '';
                    }
                });
            };
            function scrollWin() {
                window.scrollBy(0, 800);
            }

            self.init = function() {
                ngMeta.setTitle("Consumers - Venuelytics");
                ngMeta.setTag('image', 'assets/img/screen2.jpg');
                ngMeta.setTag('description', 'Personalized Real-Time Premium Services to Consumers!');
                var urlPattern = $location.absUrl();
                var data = urlPattern.split(".");
                if(data[1] === "venuelytics") {
                    $rootScope.facebook = APP_LINK.FACEBOOK_ITZFUN;
                    $rootScope.twitter = APP_LINK.TWITTER_ITZFUN;
                    $rootScope.instagram = APP_LINK.INSTAGRAM_ITZFUN;
                }

                $('.selectpicker').selectpicker({
                    style: 'btn-info',
                    size: 4
                });

                self.selectedCountry = APP_ARRAYS.country[0];
                self.countries = APP_ARRAYS.country;

                if(DataShare.latitude && DataShare.longitude && 
                    DataShare.latitude !== '' && DataShare.longitude !== ''){

                    self.gettingLocation(DataShare.latitude, DataShare.longitude);
                } else{

                    if (navigator && navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position){
                            DataShare.latitude = position.coords.latitude; 
                            DataShare.longitude = position.coords.longitude;
                            self.gettingLocation(DataShare.latitude, DataShare.longitude);
                            self.$apply(function(){
                                self.position = position;
                            });
                        },
                        function (error) { 
                            // self.gettingLocation();
                        });
                    } else{
                        $log.info("Do nothing");
                        // self.gettingLocation();
                    }    
                }

                var videos  = $(".video");

                videos.on("click", function(){
                    var elm = $(this),
                        conts   = elm.contents(),
                        le      = conts.length,
                        ifr     = null;

                    for(var i = 0; i<le; i++){
                      if(conts[i].nodeType == 8) ifr = conts[i].textContent;
                    }

                    elm.addClass("player").html(ifr);
                    elm.off("click");
            });				
            };

            self.init();

            self.venueInNewCityDescriptionModal = function(value) {
                $rootScope.privateDescription = value;
                $('.modal-backdrop').remove();
            };
    		self.selectCity = function(city) {
                $location.url('/cities/'+city.name);
    		};

            self.previousPage = function() {
                self.next = false;
                if(nextPageSize > 0) {
                    nextPageSize = nextPageSize - 50;
                    AjaxService.getVenuesByCountry(self.selectedCountry.shortName, nextPageSize).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
                }
            };

            self.getVenueBySearch = function(venueSearch){
                self.listOfCities = [];
                AjaxService.getVenueBySearch(DataShare.latitude, DataShare.longitude, venueSearch).then(function(response) {
                    self.listOfVenuesByCity = response.venues;
                    angular.forEach(self.listOfVenuesByCity, function(value, key) {
                        value.feature = value.info["Advance.featured"];
                    });
                    if(self.searchVenue === true){
                        scrollWin();
                    }
                });
            };

            self.getVenuesKeyEnter = function(keyEvent,venueSearch) {
                self.listOfCities = [];
                if (keyEvent.which === 13){
                    self.getVenueBySearch(venueSearch);
                }
            };
            $rootScope.getSearchBySearch = function(venueSearch){
                self.getCity(venueSearch);
                self.searchVenue = true;
            };
            $rootScope.getserchKeyEnter = function(keyEvent,venueSearch) {
                if (keyEvent.which === 13){
                    $rootScope.getSearchBySearch(venueSearch);
                }
            };
            self.venueRefId = function(venue) {
                if (!venue.uniqueName) {
                    return venue.id;
                } else {
                    return venue.uniqueName;
                }
            }
            self.selectVenue = function(venue) {
                self.selectedCityName = venue.city;
                $location.url('/cities/' + self.selectedCityName + '/' + self.venueRefId(venue) );
            };

            self.getCityKeyEnter = function(keyEvent,citySearch) {
                self.listOfVenuesByCity = [];
                if (keyEvent.which === 13){
                    self.getCity(citySearch);
                }
            };

            self.nextPage = function() {
                self.next = true;
                nextPageSize = nextPageSize + 50;
                AjaxService.getVenuesByCountry(self.selectedCountry.shortName, nextPageSize).then(function(response) {
                    self.listOfCities = response;
                    self.loadingBar = false;
                });
            };
    }]);
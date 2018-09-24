/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('VenueDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', '$rootScope', '$routeParams', 'AjaxService', '$sce',
    function ($log, $scope, $http, $location, RestURL, $rootScope, $routeParams, AjaxService, $sce) {

    		$log.log('Inside Venue Details Controller.');
    		
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
                    var imageParam = $location.search().i;
                    if(imageParam === 'Y') {
                        var URL = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id + '?i=' + imageParam;
                        self.reservationURL = $sce.trustAsResourceUrl(URL);
                    } else {
                        if($routeParams.serviceType === 'p' || $routeParams.serviceType === 'b' || $routeParams.serviceType === 'g') {
                            self.row = 1;
                        } else if($routeParams.serviceType === 't' || $routeParams.serviceType === 'f' || $routeParams.serviceType === 'd') {
                            self.row = 2;    
                        } else if($routeParams.serviceType === 'o' || $routeParams.serviceType === 'e'){
                            self.row = 4;
                        } else {
                            self.row = 1;
                        }
                        var url = RestURL.adminURL+'reservation/'+self.detailsOfVenue.id + '?r=' + self.row + '&t=' + $routeParams.serviceType;
                        self.reservationURL = $sce.trustAsResourceUrl(url);
                        $log.info("URL:", self.reservationURL);
                    }
                   
                    iFrameResize({
                            log                     : false,                  // Enable console logging
                            inPageLinks             : false,
                            heightCalculationMethod: 'max',
                            widthCalculationMethod: 'min',
                            sizeWidth: false,
                            checkOrigin: false
                        });

                    $(function(){
                        $('#venueReservationFrame').on('load', function(){
                            $('#loadingVenueDetails').hide();
                            $(this).show();
                        });
                            
                    });
                });
            };

            self.init();
            self.scrollToTop($window);
    		
    }]);
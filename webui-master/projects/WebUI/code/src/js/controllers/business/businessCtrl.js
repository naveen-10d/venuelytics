"use strict";
app.controller('BusinessController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', 'AjaxService', 'APP_ARRAYS', '$rootScope', '$routeParams', 'APP_LINK', '$templateCache', 'ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, AjaxService, APP_ARRAYS, $rootScope, $routeParams, APP_LINK, $templateCache, ngMeta) {

        $log.log('Inside Business Controller');

        var self = $scope;

        $rootScope.showItzfun = false;
        $rootScope.selectedTab = 'business';
        $scope.business = {};
        $rootScope.blackTheme = "";
        self.init = function () {
            ngMeta.setTitle("Real Time Venue Management Platform");
            ngMeta.setTag('image', 'assets/img/screen2.jpg');
            ngMeta.setTag('description', 'VenueLytics empowers businesses, in the entertainment, hospitality and service industries, to engage their customers in real-time and deliver Table & Bottle Service Reservations, Food & Drink Ordering, Private Event Bookings, Events Booking');

            var urlPattern = $location.absUrl();
            var data = urlPattern.split(".");
            if (data[1] === "itzfun") {
                $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
                $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
                $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
                utmPayload.utmTerm = "ItzFun";
            }


            var videos = $(".video");

            videos.on("click", function () {
                var elm = $(this),
                    conts = elm.contents(),
                    le = conts.length,
                    ifr = null;

                for (var i = 0; i < le; i++) {
                    if (conts[i].nodeType == 8) ifr = conts[i].textContent;
                }

                elm.addClass("player").html(ifr);
                elm.off("click");
            });
        };
        self.sendEmail = function (email, medium, campaign, claimBusiness) {

            if ((email !== undefined) && (email !== '')) {
                $rootScope.claimBusiness = typeof (claimBusiness) === 'undefined' ? false : !!claimBusiness;
                $rootScope.subscribeMedium = medium;
                $rootScope.subscribeCampaign = campaign;

                $('#subscribeModalBusiness').modal('show');
                $('.modal-backdrop').remove();
                $rootScope.successEmail = email;
            }
        };
        self.claimBusiness = function (email) {
            self.sendEmail(email, 'business-claim-business', '30DaysFree', true);
        };


        self.searchName = function () {
            
            $rootScope.businessName = $scope.business.businessName;
            $rootScope.businessAddress = $scope.business.businessAddress;
            
            var q = "";

            if ( typeof($scope.business.businessName) != 'undefined' && $scope.business.businessName.length > 0) {
                q = q + "name=" + $scope.business.businessName;
            }

            if ( typeof($scope.business.businessAddress) != 'undefined' && $scope.business.businessAddress.length > 0) {
                q = q + "&s=" + $scope.business.businessAddress;
            }

            $location.url("/searchBusiness?" + q);

        };

        self.saveBusiness = function () {
            var business = $scope.business;
            var role = (typeof business.businessRole === 'undefined') ? '' : business.businessRole.role;
            var subscribeEmail = {
                "email": $rootScope.successEmail,
                "mobile": business.phoneNumber,
                "name": business.NameOfPerson,
                "businessName": business.businessName,
                "role": role,
                "utmSource": "venuelytics.com",
                "utmCampaign": $rootScope.subscribeCampaign,
                "utmMedium": $rootScope.subscribeMedium
            };

            AjaxService.subscribe(subscribeEmail).then(function (response) {
                $rootScope.successEmail = subscribeEmail.email;
                DataShare.claimBusiness = subscribeEmail;
                if (!$rootScope.claimBusiness) {
                    $('#subscribeSuccessModalBusiness').modal('show');
                    $('.modal-backdrop').remove();
                    self.subscribeEmails = '';
                    $rootScope.emailToSend = '';
                } else {
                    $location.url("/searchBusiness?s=" + subscribeEmail.businessName);
                }
            });
        };
        self.init();
    }]).filter('trusted', ['$sce', function ($sce) {
        return function (url) {
            var video_id = url.split('v=')[1].split('&')[0];
            return $sce.trustAsResourceUrl("//www.youtube.com/embed/" + video_id);
        };
    }]);
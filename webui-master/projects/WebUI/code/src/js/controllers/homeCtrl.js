/**
 * @author Saravanakumar K
 * @date 25-MAY-2017
 */
"use strict";
app.controller('HomeController', ['$log', '$scope', '$location', 'DataShare', '$translate', 'APP_CLIENTS', 'APP_ARRAYS', '$rootScope', 'AjaxService', 'APP_LINK', 'ngMeta',
    function ($log, $scope, $location, DataShare, $translate, APP_CLIENTS, APP_ARRAYS, $rootScope, AjaxService, APP_LINK, ngMeta) {

        $log.log('Inside Home Controller.');
        ngMeta.setTitle("Home - Venuelytics");
        var self = $scope;
        $rootScope.blackTheme = "";
        $rootScope.showItzfun = false;
        self.clientImages = APP_CLIENTS.clientImages;
        $rootScope.businessRoles = APP_ARRAYS.roles;
        $rootScope.selectedTab = 'home';
        $rootScope.videoUrl = APP_LINK.VIDEO_PLAY;
        $scope.iPhoneImage = true;
        $scope.business = {};
        $scope.carouselData = [
           
            { image: '', title: '', details: '' },

        ];
        $scope.$on('$locationChangeStart', function (event) {
            var userSelectedTab = $location.absUrl().split('/').pop().split('?');
            $rootScope.canonicalURL = $location.absUrl();
        });

        self.featureClick = function (feature) {
            $location.url('/business/#' + feature.ref);
        };
        self.init = function () {
            
            self.venueLyticsFeatures =  [
            { 'ref': 'guest-engagement', 'title': 'Guest Engagement', 'description': 'FEATURE_REAL_TIME_DESC'},
            { 'ref': 'real-time-reservations', 'title': 'Concierge Services', 'description': 'FEATURE_REAL_TIME_DESC'},
            { 'ref': 'loyalty-management', 'title': 'Marketing & Promotion', 'description': 'FEATURE_REAL_TIME_DESC'},
            { 'ref': 'wifi-services', 'title': 'Business Analytics', 'description': 'FEATURE_REAL_TIME_DESC'},
            { 'ref': '3rd-integration', 'title': 'Third-party Integration', 'description': 'FEATURE_REAL_TIME_DESC'},
            ];

            ngMeta.setTag('image', 'assets/img/screen2.jpg');
            ngMeta.setTag('description', 'The VenueLytics Business App is a AI-Driven Venue Management & Entertainment Platform which provides venues like Casinos, Resorts, Stadiums, Top Golf, Clubs, Bars, Lounges, Karaoke & Bowling Alleys with features that generate incremental revenue through service requests, mobile pay, analytics, rewards and more. Venues can also reach and enhance customer’s experience real-time via the “ItzFun!” consumer app.');
            var urlPattern = $location.absUrl();
            var data = urlPattern.split(".");
            if (urlPattern.toLowerCase().indexOf("itzfun.com") >= 0) {
                $rootScope.facebook = APP_LINK.FACEBOOK_ITZFUN;
                $rootScope.twitter = APP_LINK.TWITTER_ITZFUN;
                $rootScope.instagram = APP_LINK.INSTAGRAM_ITZFUN;
                $scope.showBusinessLink = false;
                if ((urlPattern === "http://www.itzfun.com/") || (urlPattern === "https://www.itzfun.com/")) {
                    $location.url('/cities');
                }
            } else {
                $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
                $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
                $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
                $scope.showBusinessLink = true;
            }
            $rootScope.venuelyticsAppUrl = APP_LINK.APPLE_STORE_VENUELYTICS;
            $rootScope.itzfunAppUrl = APP_LINK.APPLE_STORE_ITZFUN;

            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            if (/android/i.test(userAgent)) {
                $rootScope.venuelyticsAppUrl = APP_LINK.GOOGLE_PLAY_VENUELYTICS;
                $rootScope.itzfunAppUrl = APP_LINK.GOOGLE_PLAY_ITZFUN;
            }

            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                $rootScope.venuelyticsAppUrl = APP_LINK.APPLE_STORE_VENUELYTICS;
                $rootScope.itzfunAppUrl = APP_LINK.APPLE_STORE_ITZFUN;
            }
             var videos = $(".video_turnkey");

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
            $(document).ready(function () {
                $('#venuelytics-presentation').carousel({
                    interval: 3000
                });
                var slides = $('#venuelytics-presentation').carousel('cycle');

                $('#venuelytics-presentation').on('slid.bs.carousel', function () {
                    self.$apply(function () {
                        self.iPhoneImage = $('div.active').index() == 0;
                        console.log(self.iPhoneImage);
                    });
                });

                var owl = $('.owl-carousel');
                owl.owlCarousel({
                    loop: true,
                    autoplay: true,
                    autoplayTimeout: 1000,
                    dots: false,
                    mouseDrag: true,
                    touchDrag: true,
                    responsive: {
                        0: { items: 2 },
                        480: { items: 3 },
                        768: { items: 4 },
                        992: { items: 5 },
                        1200: { items: 6 },
                    },
                    margin: 60,
                    nav: false
                });

                /* $( ".owl-prev").html('<img src="assets/img/arrow_left.png">');
                 $( ".owl-next").html('<img src="assets/img/arrow_right.png">');*/
            });


        };



        self.changeLanguage = function (lang) {
            $translate.use(lang);
        };
        $rootScope.closeStore = function () {
            $rootScope.venuelyticsApp = false;
            $rootScope.itzfunApp = false;
            $rootScope.panelShow = false;
        };
        self.sendEmail = function (email, medium, campaign, claimBusiness) {

            if ((email !== undefined) && (email !== '')) {
                $rootScope.claimBusiness = typeof (claimBusiness) === 'undefined' ? false : !!claimBusiness;
                $rootScope.subscribeMedium = medium;
                $rootScope.subscribeCampaign = campaign;
                $scope.business = {};
                $('#subscribeModalHome').modal('show');
                $('.modal-backdrop').remove();
                $rootScope.successEmail = email;
            }
        };
        self.claimBusiness = function (email) {

            self.sendEmail(email, 'homepage-claim-business', '30DaysFree', true);
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
            var business = self.business;
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
                    $('#subscribeSuccessModalHome').modal('show');
                    $('.modal-backdrop').remove();
                    self.subscribeEmails = '';
                    $rootScope.emailToSend = '';
                } else {
                    $location.url("/searchBusiness?s=" + subscribeEmail.businessName);
                }

            });
        };
        self.init();

    }]);

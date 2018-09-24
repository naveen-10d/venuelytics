/**
 * @author Navaneethan
 */
"use strict";
app.controller('PricingController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', 'PRICING_APP', '$rootScope', 'AjaxService','ngMeta',
    function ($log, $scope, $http, $location, RestURL, DataShare,  PRICING_APP, $rootScope, AjaxService, ngMeta) {

        var self = $scope;
        $rootScope.selectedTab = 'pricing';
        $rootScope.blackTheme = "";
        self.init = function() {
            self.basicPrice = PRICING_APP.BASIC_PRICE;
            self.professionalPrice = PRICING_APP.PROFESSIONAL_PRICE;
            self.enterPrise = PRICING_APP.ENTER_PRICE;
            self.planFeature = PRICING_APP.PLAN_FEATURE;
            self.basicFee = PRICING_APP.BASIC_FEE;
            self.FreeTier = PRICING_APP.FREE_TIER;
            self.FreePrice = PRICING_APP.FREE_PRICE;
            
            self.basicFeeIdeal = PRICING_APP.BASIC_FEE_IDEAL;
            self.freeTierIdeal = PRICING_APP.FREE_TIER_IDEAL;

            self.professionalFee = PRICING_APP.PROFESSIONAL_FEE;
            self.professionalFeeEverything = PRICING_APP.PROFESSSIONAL_FEE_EVERYTHING;
            self.enterpriseFee = PRICING_APP.ENTERPRISE_FEE;
            self.enterpriseFeeAdvanced = PRICING_APP.ENTERPRISE_FEE_ADVANCED;
            self.reservationPromotation = PRICING_APP.RESERVATION_PROMOTATION;
            self.reservationPromotationArray = PRICING_APP.RESERVATION_PROMOTATION_ARRAY;
            
            self.premiumServices = PRICING_APP.PREMIUM_SERVICES;
            self.premiumServicesArray = PRICING_APP.PREMIUM_SERVICES_ARRAY;
            self.wifiMonetization = PRICING_APP.WIFI_MONETIZATION;
            self.wifiMonetizationArray = PRICING_APP.WIFI_MONETIZATION_ARRAY;
            self.monthlyPrice = PRICING_APP.MONTHLY_PRICE;
            self.perMonth = PRICING_APP.PER_MONTH;

            ngMeta.setTitle("Pricing - Venuelytics");
            ngMeta.setTag('image', 'assets/img/screen2.jpg');
            ngMeta.setTag('description',"Claim or Create your Business Services Page! Try VenueLytics free for 30 days, no credit card required");
        };

        self.init();

    }]);
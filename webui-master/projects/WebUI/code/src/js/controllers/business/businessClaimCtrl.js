"use strict";
app.controller('BusinessClaimController', ['$log', '$scope', '$rootScope','$http', '$location', 'AjaxService','$routeParams', 'APP_LINK',
 function ($log, $scope, $rootScope, $http, $location, AjaxService, $routeParams, APP_LINK) {

    var self = $scope;
    $rootScope.blackTheme = "";
    self.init = function() {
        self.venueNumber = $routeParams.venueId;
        var urlPattern = $location.absUrl();
        var data = urlPattern.split(".");
        if(data[1] === "itzfun") {
            $rootScope.facebook = APP_LINK.FACEBOOK_VENUELYTICS;
            $rootScope.twitter = APP_LINK.TWITTER_VENUELYTICS;
            $rootScope.instagram = APP_LINK.INSTAGRAM_VENUELYTICS;
        }
        var vc = $location.search().vc;
        var ce = $location.search().ce;
        self.successMessage = !!$location.search().successful ;
        AjaxService.completeBusinessClaim(self.venueNumber, vc, ce).then(function(response) {
           $log.info(response);
           if (response.status === 200 || response.status === 201) {
            $location.url("/deployment/" + self.venueNumber +'?successful'); 
           } else if (response.status === 202){
                $location.url("/businessAlreadyClaimed/" + self.venueNumber);
           } else {
             self.error = true;
           }
           
        }, function(error){
           self.error = true;
        });
    };
    
    self.init();
    
     		
}]);

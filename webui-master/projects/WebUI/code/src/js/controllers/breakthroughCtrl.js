/**
 * @author Saravanakumar K
 * @date 09-SEP-2017
 */
"use strict";
app.controller('Breakthrough', ['$log', '$scope', 'DataShare', '$routeParams','APP_ARRAYS','$rootScope','ngMeta', 
    function ($log, $scope, DataShare, $routeParams, APP_ARRAYS, $rootScope, ngMeta) {

    	$log.log('Inside BreakThrough Controller.');
        $rootScope.blackTheme = "";
    	var self = $scope;
        self.init = function() {
            $rootScope.title = 'Venuelytics Digital Concierge Solution';
            ngMeta.setTitle('Venuelytics Digital Concierge Solution');
            self.throughId = $routeParams.throughId;	
            self.breakThroughUrl = APP_ARRAYS.breakThrough[self.throughId];
        };

        self.init();
    }]);
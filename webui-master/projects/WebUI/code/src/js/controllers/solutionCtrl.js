/**
 * @author Suryanarayana
 * @date Jan -2 
 */
"use strict";
app.controller('SolutionController', ['$scope', '$rootScope', 'ngMeta',
    function ($scope, $rootScope, ngMeta) {

    		
    		var self = $scope;
    		$rootScope.selectedTab = 'solution';
			
			ngMeta.setTag('description', "Venuelytics - Business Solutions");
			$rootScope.title = " Venuelytics - Business Solutions";
			ngMeta.setTitle($rootScope.title);
        	
    }]);

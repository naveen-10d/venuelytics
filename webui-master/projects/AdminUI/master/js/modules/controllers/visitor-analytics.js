'use strict';
App.controller('VisitorAnalyticsController',['$log','$scope','ContextService',  'RestServiceFactory','$translate','Session','$state', '$stateParams',
                                      function($log, $scope, contextService,  RestServiceFactory, $translate, session, $state, $stateParams) {
	
    'use strict';
    $scope.favProducts = [];
    
    $scope.init = function() {
    	$scope.effectiveVenueId = contextService.userVenues.selectedVenueNumber;
        
    	var promise = RestServiceFactory.AnalyticsService().getVisitorAnalytics({id: $scope.effectiveVenueId, visitorId: $stateParams.visitorId});
    	promise.$promise.then(function(data) {
    		$scope.data = data;
    		
    		$scope.serviceRequests = $scope.addValues(data.servicesUsed, "count");
    		$scope.reservations = $scope.addValues(data.reservationsMade, "count");
            $scope.cancelations = $scope.addValues(data.reservationsMade, "canceledCount");
    		$scope.revenueEstimate = $scope.addValues(data.reservationsMade, "revenueEstimate");
    		$scope.totalGuest = $scope.addValues(data.reservationsMade, "totalGuests");

    		$scope.favProducts = $scope.categories(data.favProducts);
            $scope.reservations = $scope.reservations - $scope.cancelations;
            if ($scope.reservations < 0) {
                $scope.reservations = 0;
            }
    		for (var idx in $scope.favProducts ) {
    			$scope.favProducts[idx].data.sort(compare);
    		}

            $scope.services = [];
            for (var idx1 in $scope.data.serviceAvailedDate) {
                if (idx1 > 0){
                    var cf = moment($scope.data.serviceAvailedDate[idx1].serviceDate).fromNow();
                    var pf = moment($scope.data.serviceAvailedDate[idx1-1].serviceDate).fromNow();
                   if (cf !== pf) {
                    var elem = {};
                    elem.timelineSeparator = true;
                    elem.timelineLabel = cf;
                    $scope.services.push(elem);
                   }
                }
                var elem = $scope.data.serviceAvailedDate[idx1];
                elem.timelineSeparator = false;
                $scope.services.push(elem);
            }

    	});
    };
    
    function compare(e1, e2) {
    	return e2.value - e1.value;
    }

    
    $scope.categories = function(favProducts) {

    	var data = [];
    	var map = [];
    	Object.keys(favProducts).forEach(function(key,index) {
    	 	var value = favProducts[key];


    		var parts = key.split(' - ');
    		var series = map[parts[0]];
    		if (!series) {
    			series = {};
    			map[parts[0]] = series;
    			data.push(series);
    			series.name = parts[0];
    			series.data  = [];
    		}
			var elem = {};
			elem.type = parts[0];
			elem.name = parts[1];
			elem.value = value;

			series.data.push(elem);
    		

		});

		return data;
    	

    };
    
    $scope.getBgClass = function(serviceType) {
    	
        if (serviceType === 'Bottle') {
            return "warning";
        } else if (serviceType === 'BanquetHall') {
            return "danger";
        } else if (serviceType === 'Food'){
            return "info";
        } else if (serviceType === 'Drink' || serviceType === 'Drinks'){
            return "primary";
        } else if (serviceType === 'GuestList'){
            return "green-light";
        } else if (serviceType === 'Restaurant'){
            return "info-dark";
        }

    };
    
    $scope.getIcon = function(serviceType) {
    	if (serviceType === 'Bottle') {
    		return "app/img/bottle.png";
    	} else if (serviceType === 'BanquetHall') {
    		return "app/img/private.png";
    	} else if (serviceType === 'Food'){
    		return "app/img/food.png";
    	} else if (serviceType === 'Drink' || serviceType === 'Drinks'){
            return "app/img/drinks.png";
        } else if (serviceType === 'GuestList'){
            return "app/img/guest.png";
        } else if (serviceType === 'Restaurant'){
            return "app/img/table.png";
        }
    };

    $scope.addValues = function(obj, propertyName) {
    	
    	var value = 0;
    	Object.keys(obj).forEach(function(key,index) {
    		if (obj[key].hasOwnProperty(propertyName)) {
    			value += obj[key][propertyName];
    		} else {
    	 		value += obj[key];
    	 	}
		});
		return value;

    };

    $scope.init();
    

}]);
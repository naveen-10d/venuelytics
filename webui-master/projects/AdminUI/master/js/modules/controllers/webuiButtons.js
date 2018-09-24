
App.controller('WebuiButtonsController', ['$state', '$stateParams', '$scope', '$rootScope', 'ContextService', 'RestServiceFactory', 'APP_EVENTS',
    function ($state, $stateParams, $scope, $rootScope, contextService, RestServiceFactory, APP_EVENTS) {
        "use strict";
        var UI_SERVICE_BTNS = 'ui.service.service-buttons';
        
        $scope.buttonsUI = [{
            "id": "bottleTab",
            "name": "Bottle Services",
            "serviceName": "bottle-service",
            "color": "#7A11D9", 
            "hide": false,
            "showVenueMap": 'N',
            "showVenueMapReservations": 'N',
            "allowReservationSelection": 'N'
        },
        {
            "id": "privateEventTab",
            "name": "Private Events",
            "serviceName": "private-event",
            "color": "#0E68A7",
            "hide": false,
             "showVenueMap": 'N',
            "showVenueMapReservations": 'N',
            "allowReservationSelection": 'N'
        },
        {
            "id": "guestlistTab",
            "name": "Guest List",
            "serviceName": "guest-list",
            "color": "#DC112A", 
            "hide": false
        },
        {
            "id": "tableServiceTab",
            "name": "Table Service",
            "serviceName": "table-service",
            "color": "#DC992A",
            "hide": false,
             "showVenueMap": 'N',
            "showVenueMapReservations": 'N',
            "allowReservationSelection": 'N'
        },
        {
            "id": "foodServiceTab",
            "name": "Food Service",
            "serviceName": "food-service",
            "color": "#1E8644",
            "hide": false,
             "showVenueMap": 'N',
            "showVenueMapReservations": 'N',
            "allowReservationSelection": 'N'
        },
        {
            "id": "drinkServiceTab",
            "name": "Drink Services",
            "serviceName": "drink-service",
            "color": "#DA0615",
            "hide": false,
             "showVenueMap": 'N',
            "showVenueMapReservations": 'N',
            "allowReservationSelection": 'N'
        },
        {
            "id": "waitTimeTab",
            "name": "Wait Time",
            "serviceName": "wait-time", 
            "color": "#3C3C3C",
            "hide": false
        },
        {
            "id": "contestsTab",
            "name": "Contests",
            "serviceName": "contests",
            "color": "#C83C3C",
            "hide": false
        },
        {
            "id": "rewardsTab",
            "name": "Rewards",
            "serviceName": "rewards", 
            "color": "#C8C81E",
            "hide": false
        },
        {
            "id": "dealsServiceTab",
            "name": "Deals",
            "serviceName": "deals-list",
            "color": "#98399D",
            "hide": false
        },
        {
            "id": "eventListTab",
            "name": "Event List",
            "serviceName": "event-list",
            "color": "#000000",
            "hide": false
        },
        {
            "id": "wineToHomeTab",
            "name": "Wine To Home",
            "serviceName": "wine-to-home",
            "color": "#1E3CFA",
            "hide": false
        },{
            "id": "reservationTab",
            "name": "Reservation",
            "serviceName": "reservation",
            "color": "#5E3C0A",
            "hide": false,
             "showVenueMap": 'N',
            "showVenueMapReservations": 'N',
            "allowReservationSelection": 'N'

        },
        {
            "id": "nightLifeTab",
            "name": "NightLife",
            "serviceName": "night-life", 
            "color": "#E18C8C",
            "hide": false
        },
        {
            "id": "attractionsTab",
            "name": "Attractions",
            "serviceName": "attractions", 
            "color": "#334E66",
            "hide": false
        }];

       
        $scope.inArray = function (id, array) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].id === id) { 
                	return true; 
                }
            }
            return false;
        };
        $scope.hideBtn = function(btn) {
        	for (var i=0; i < $scope.buttonsUI.length; i++) {
                if ($scope.buttonsUI[i].id === btn.id) {
                    //$scope.buttonsUI.splice($scope.buttonsUI.indexOf($scope.buttonsUI[i]), 1);
                    $scope.buttonsUI[i].hide = true;
                }
            }
        }

        $scope.canShow = function(v) {
            return typeof(v) !== 'undefined';
        };
        $scope.init = function () {
            $scope.editButton = {};
            $scope.newButtonArray = [];
            $scope.IsVisible = false;
            $scope.buttonsUIMap = $.Apputil.makeMap($scope.buttonsUI);
            $scope.venueNumber = $stateParams.id;
	        $("#droptarget").droppable({
	            drop: function (event, ui) {
                    var id = $(ui.draggable).attr("id");
                    var name = $(ui.draggable).attr("name");
                    var defButton = $scope.buttonsUIMap[name];

                    var currentDraggableButton = $.extend({}, defButton)

	                /*var currentDraggableButton = {
	                    id: $(ui.draggable).attr("id"),
	                    name: $(ui.draggable).attr("name"),
	                    color: $(ui.draggable).attr("color"),
	                    serviceName: $(ui.draggable).attr("serviceName")
	                };*/
                    
	                if (!$scope.inArray(id, $scope.newButtonArray)) {
	                	//$(ui.draggable).clone().appendTo(this);
	                    $scope.$apply(function() {
		                    $scope.hideBtn(currentDraggableButton);
	                    	$scope.newButtonArray.push(currentDraggableButton);	
	                    });
	                    
	                }
	            }
	        });
	       	$("#dragtarget").sortable();
	        $(".ui-service-buttons").draggable({
				containment : "#container",
				helper : 'clone',
				revert : 'invalid'
			});

	        $("#droptarget").sortable();

	        $("#basicColor").spectrum({
	            color: "#37bc9b",
	            preferredFormat: "hex",
	            showPalette: true,
	            showInput: true,
			    showSelectionPalette: true, // true by default
			    palette: ["#7A11D9", "#0E68A7", "#DC112A", "#DC992A","#1E8644","#DA0615", "#3C3C3C", "#C83C3C", "#C8C81E", "#98399D", "#000000", "#1E3CFA"],
	            change: function (color) {
	            }
	        });

            RestServiceFactory.VenueService().getInfo({ id: $scope.venueNumber }, function(data){
            	var jsonStr = data[UI_SERVICE_BTNS];
            	if (jsonStr && jsonStr.length > 0) {
	            	var btns = JSON.parse(jsonStr);
	            	$scope.newButtonArray = [];
	            	for (var i = 0; i < btns.length; i++) {
	            		var btn = btns[i];
	            		$scope.hideBtn(btn);
	            		$scope.newButtonArray.push(btn);
	            	}
	            }
            });

	    };
        $("#droptarget").on("click", ".fa-times",function() {
        	var button = $(this).parent()[0];
        	for (var i = 0; i < $scope.newButtonArray.length; i++) {
                if ($scope.newButtonArray[i].id === button.id) {
                	$scope.$apply(function() {
                    	$scope.newButtonArray.splice($scope.newButtonArray.indexOf($scope.newButtonArray[i]), 1);
                    	for (var j=0; j < $scope.buttonsUI.length; j++) {
	                        if ($scope.buttonsUI[j].id === button.id) {
	                            //$scope.buttonsUI.splice($scope.buttonsUI.indexOf($scope.buttonsUI[i]), 1);
	                            $scope.buttonsUI[j].hide = false;
	                            break;
	                        }
	                    }
                    });
                    return;
                }
            }

        });
        

        $scope.currentButton = function (data, index) {
            $scope.editButton = data;
            $scope.IsVisible = true;
            $("#basicColor").spectrum("set", data.color);
        };

        $scope.save = function () {
        	var btns = [];
            var orderMap = [];

        	for (var i=0; i < $scope.newButtonArray.length; i++) {
        		var src = $scope.newButtonArray[i];
                var btn = angular.copy(src);
        		
        		//btns.push(btn);
                orderMap[src.id] = btn;
        	}

            var orderedIds = $('#droptarget').sortable("toArray");
            for (var oi=0; oi < orderedIds.length; oi++) {
                var btn = orderMap[orderedIds[oi]];
                if (!!btn) {
                    btns.push(btn);
                }
            }

        	var uiBtnsJson = JSON.stringify(btns);
            var payload = {};

             payload[UI_SERVICE_BTNS]  = uiBtnsJson;
               
            var target = { id: $scope.venueNumber };
            RestServiceFactory.VenueService().updateAttribute(target, payload, function (success) {

                $log.log("success: ", data);

            }, function (error) {
                if (typeof error.data !== 'undefined') {
                    toaster.pop('error', "Server Error", error.data.developerMessage);
                }
            });
        };

        $scope.init();
    }]);

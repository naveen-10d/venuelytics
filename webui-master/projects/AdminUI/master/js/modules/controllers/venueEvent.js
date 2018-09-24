/**=========================================================
 * Module: userInfo.js
 * smangipudi
 =========================================================*/

App.controller('VenueEventController', ['$scope', '$timeout', '$state','$stateParams', 'RestServiceFactory', 
    'toaster','DialogService','ngDialog','DataTableService','$compile','ContextService', 'Session', 'APP_EVENTS',
    function($scope, $timeout, $state, $stateParams, RestServiceFactory, toaster, DialogService, ngDialog, DataTableService, $compile, contextService, Session, APP_EVENTS) {
  'use strict';
    
    var n = $scope.minDate = new Date(2017,6,6);
    
    $scope.maxDate = new Date(2018,11,31);
    $scope.contextService = contextService;
    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.config = {};
    $scope.config.scheduleRadio = "N";

    $scope.eventTypes = {};


    $scope.ageRestrictions = [
        { label: "No restriction", value: "NONE"}
    ];

    for (var idx = 2; idx <=21; idx++) {
        var obj = {};
        obj.label = idx + " years and above";
        obj.value = idx +"+";
        $scope.ageRestrictions.push(obj);
    }

    $scope.agePricePolicies = [{label: "NONE", value: "No free passes."}];

    for (idx = 1; idx <=14; idx++) {
        var obj = {};
        obj.label = "Free for age " + idx + " years and younger";
        obj.value = idx +"-";
        $scope.agePricePolicies.push(obj);
    }
   
   $scope.performers = [];
    var self = $scope;
    RestServiceFactory.PerformerService().get(function(data) {
        self.performers = data.performers;
        setTimeout(function () {
            $('#performerList').trigger('chosen:updated');
        });
       /* setTimeout(function () {
            self.$apply(function () {
                
                self.chosenTS = 1;
            });
        });*/
        
    });
     
   
  // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return false;
    };
    
    $scope.eventDisplayTime = new Date();
    $scope.eventDisplayTime.setHours(0);
    $scope.eventDisplayTime.setMinutes(0);
    $scope.eventDisplayTime.setSeconds(0);
    console.log($scope.eventDisplayTime);

    $scope.data = {};
    if($stateParams.id !== 'new') {
	    var promise = RestServiceFactory.VenueService().getEvent({id:$stateParams.id});
	    promise.$promise.then(function(data) {
	    	$scope.data = data;
            if (typeof data.performers != 'undefined') {
                $scope.data.performers = data.performers.split(";");
            }

            var startDate = $scope.data.startDate.substring(0,10);
            var from = startDate.split("-");
            $scope.data.startDate = new Date(from[0], from[1] - 1, from[2]);

            var endDate = $scope.data.endDate.substring(0,10);
            from = endDate.split("-");
            $scope.data.endDate = new Date(from[0], from[1] - 1, from[2]);

            $scope.hours = Math.floor($scope.data.durationInMinutes / 60);
            $scope.minutes = Math.floor($scope.data.durationInMinutes % 60);

            
            var t = data.eventTime.split(":");
            var h = parseInt(t[0]);
            var m = parseInt(t[1]);
            var d = new Date();

            d.setHours(h);
            d.setMinutes(m);
            d.setSeconds(0);
            $scope.eventDisplayTime = d;
            $scope.config.scheduleRadio = data.scheduleDayOfWeek.length >0 ? 'W' : data.scheduleDayOfMonth.length >0 ? 'M' : 'N';
            $scope.getStores();
            //$scope.changed();
	    });
    } else {
    	var data = {};
        data.venueNumber = $stateParams.venueNumber;
    	data.enabled = 'N';
        data.processingFeeMode = 0;
    	$scope.data = data;
        $scope.data.agencyId = -1;
       

    }
    var self =  $scope;
    RestServiceFactory.VenueService().getEventCategories({id:  $stateParams.venueNumber}, function(data){
        for (var i = 0; i < data.length; i++) {
            self.eventTypes[data[i].name] = data[i].name;
        }
        if ($stateParams.id === 'new' && data.length > 0) {
            self.data.eventType = data[0].name;
        }
    });
	$scope.changed = function() {
        
    };
    $scope.showEnableDisable = function() {
        return Session.roleId >= 100 || Session.roleId === 11;
    };



    // $scope.startOpened = true;
    $('#startDtCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.startOpened = !$scope.config.startOpened;
        }, 200);
    });
    $('#endDtCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.endOpened = !$scope.config.endOpened;
        }, 200);
    });
   
    $scope.update = function(isValid, form, data) {

        if (!isValid || !$("#eventInfo").parsley().isValid()) {
            return;
        }

        if (data.startDate > data.endDate) {
            toaster.pop('error', "End Date Error", "End date needs to be same or after Start date.");
            return;
        }
        data.venueNumber = $stateParams.venueNumber;
        var t = $scope.eventDisplayTime;
        data.eventTime = t.getHours() +":" + t.getMinutes();
        data.durationInMinutes = parseInt($scope.hours)*60 + parseInt($scope.minutes);
    	
        
        var payload = RestServiceFactory.cleansePayload('VenueEventService', data);
        payload.performers = payload.performers.join(";");
        payload.performerId = -1;

        var target = {id: data.id};
        if ($stateParams.id === 'new'){
          target = {};
        }
         if($scope.config.scheduleRadio === 'N') {
            payload.scheduleDayOfWeek = '';
            payload.scheduleDayOfMonth = '';
        } else if($scope.config.scheduleRadio === 'M') {
            payload.scheduleDayOfWeek = '';
        } else {
            payload.scheduleDayOfMonth = '';
        }
        console.log(JSON.stringify(payload))

        RestServiceFactory.VenueService().saveEvent(target, payload, function(success){
         
            ngDialog.openConfirm({
              template: '<p>venue Event information  successfully saved</p>',
              plain: true,
              className: 'ngdialog-theme-default'
            });
          
          $state.go('app.eventManagement');
        },function(error){
          if (typeof error.data !== 'undefined') {
           toaster.pop('error', "Server Error", error.data.developerMessage);
          }
        });
        
    };
    $scope.uploadFile = function(images) {
        var payload = new FormData();
        payload.append("file", images[0]);
        var target ={objectType: 'venueEvent'};
        RestServiceFactory.VenueImage().uploadImage(target,payload, function(success){
          if(success !== {}){
            $scope.data.imageURL = success.originalUrl;
            toaster.pop('success', "Image upload successfull");
            document.getElementById("control").value = "";
          }
        },function(error){
          if (typeof error.data !== 'undefined') {
           toaster.pop('error', "Server Error", error.data.developerMessage);
            }
        });
    };
    $scope.storeSpec = function(store) {
        return store.name + " - " + store.address +", " + store.city;
    }
    $scope.initEventTickets = function() {
        if ( ! $.fn.dataTable ) return;
        var columnDefinitions = [
            { sWidth: "15%", aTargets: [0,1,2,3,4] },
            { sWidth: "25%", aTargets: [5] },
            {
                "targets": [5],
                "createdCell": function (td, cellData, rowData, row, col) {
                   var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>'+
                    '&nbsp;&nbsp;<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';
                    
                    $(td).html(actionHtml);
                    $compile(td)($scope);
                },
                "render": function (data, type, row, meta ) {
                  var actionHtml = '<button title="Edit" class="btn btn-default btn-oval fa fa-edit"></button>&nbsp;&nbsp;';
                  actionHtml += '<button title="Delete" class="btn btn-default btn-oval fa fa-trash"></button>';

                  return actionHtml;
                }
            }
        ];
    
        DataTableService.initDataTable('event_ticket_table', columnDefinitions, false);
        var table = $('#event_ticket_table').DataTable();
        $('#event_ticket_table').on('click', '.fa-trash', function() {
            $scope.deleteTicket(this, table);
        });

        $('#event_ticket_table').on('click', '.fa-edit', function() {
          $scope.editTicket(this, table);
        });

        var table = $('#event_ticket_table').DataTable();
       
        RestServiceFactory.VenueService().getAgencies({id: $stateParams.venueNumber}, function(data) {
            $scope.agencies = data.agencies;
           /* if ($stateParams.id === 'new' && typeof( data.agencies) !== 'undefined' && data.agencies.length > 0) {
                data.agencyId = data.agencies[0].id;
            }*/
            
        });

       

    };

    $scope.getStores = function() {
            $scope.storeNames = [];
            RestServiceFactory.AgencyService().getStores({id: $scope.data.agencyId}, function(data) {
                $scope.stores = data.stores;
                for (var i = 0; i < $scope.stores.length; i++) {
                    $scope.storeNames[$scope.stores[i].id] = $scope.stores[i];
                }
                var table = $('#event_ticket_table').DataTable();
                RestServiceFactory.VenueEventService().getEventTickets({id: $stateParams.id}, function(data) {
                    data.map(function(t) {
                        table.row.add([t.name, _STORE_NAME(t.storeNumber), _SEC(t), t.price, t.discountedPrice, t]);
                    });
                    table.draw();
                });
            });
        };
    function _STORE_NAME(id) {
        var store = $scope.storeNames[id]
        return typeof name ==='undefined' ? id : store.name;
    }
    
    $scope.editTicket = function(button, table) {
        var targetRow = $(button).closest("tr");
        var d = table.row( targetRow).data();
      
        $scope.ticket = d[5];
        
        
        var store = $scope.storeNames[$scope.ticket.storeNumber];
        $scope.store = store;
        _updateTicket(targetRow);
    };
    
    $scope.addTicket = function() {
        $scope.ticket = {};
        $scope.ticket.sectionName = "GA";
        $scope.ticket.row = "GA";
        $scope.ticket.seatStartNumber = 0;
        
        _updateTicket(null);
    };
    
    function _SEC(t) {
        var section = t.sectionName;
        if (typeof t.row !='undefined' && typeof t.seatStartNumber != 'undefined') {
            section +=  " - " +  t.row + " [" + t.seatStartNumber + "-" + (Number(t.seatStartNumber)+Number(t.count) -1) +']';
        } else if (typeof t.row !='undefined' ) {
            section += " - " +  t.row ;
        } else if (typeof t.seatStartNumber != 'undefined') {
             section +=  " - " + " [" + t.seatStartNumber + "-" + (Number(t.seatStartNumber)+Number(t.count) -1) +']';
        } 
        return section;
    }
    
    function _updateTicket(targetRow) {
        var dialog = ngDialog.open({
            template: 'app/views/venue-events/event-ticket-edit.html',
            scope : $scope,
            className: 'ngdialog-theme-default',
            controller: ['$scope', function($scope) {
            //$("#eventTicketId").parsley();
            $scope.saveEventTicket = function(eventTicketInfo) {
                
                if (eventTicketInfo.$valid && $("#eventTicketId").parsley().isValid()) {
                    var t = $scope.ticket;
                    var table = $('#event_ticket_table').DataTable();
                    var section = _SEC(t);
                    t.store = $scope.store;
                    t.storeNumber = t.store.id;
                    var target = {id: $stateParams.id};
                    if (targetRow != null) {// update actipn
                     target.ticketId = t.id;
                    }
                    var ticket = RestServiceFactory.cleansePayload('EventTicket', t);
                    var promise = RestServiceFactory.VenueEventService().saveEventTicket(target, ticket);
                    promise.$promise.then(function(data) {

                        if (targetRow == null) {
                            table.row.add([t.name, $scope.store.name, section, t.price, t.discountedPrice, data]);
                            table.draw();
                        } else {
                            var d = [t.name, $scope.store.name, section, t.price, t.discountedPrice, data];
                            table.row(targetRow).data(d).draw();
                        }
                        dialog.close();
                    });
                }
            };
          }]
        });
    }

    $scope.deleteTicket = function(button, table) {
 
        DialogService.confirmYesNo('Delete Ticket?', 'Are you sure want to delete selected Ticket?', function() {
            var targetRow = $(button).closest("tr");
            var rowData = table.row( targetRow).data();
            table.row(targetRow).remove().draw();
        });
      
    };

    $scope.init = function() {
        if($stateParams.id === 'new') {
            $scope.data.agePricePolicy = "13-";
            $scope.data.ageRestriction = "NONE";
        }
    }
    
    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        $state.go('app.eventManagement');
    });
    $scope.init();
}]);
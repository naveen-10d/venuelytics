/**=========================================================
 * Module: tickets-sold-controller.js
 *smangipudi
 =========================================================*/
App.controller('TicketsSoldController', ['$scope', '$state', '$stateParams', '$compile', '$timeout',
  'DataTableService', 'RestServiceFactory', 'toaster', 'FORMATS', 'DialogService', '$rootScope', 'ContextService', 'APP_EVENTS',
  function($scope, $state, $stateParams, $compile, $timeout, DataTableService, RestServiceFactory, toaster,
    FORMATS, DialogService, $rootScope, contextService, APP_EVENTS) {
    'use strict';
    $scope.config = {};
    $scope.config.opened = false;
    $scope.calendarDate = '';
    var n = $scope.minDate = new Date(2017,6,1);
    $scope.maxDate = new Date(n.getFullYear()+2, n.getMonth(), n.getDate());
      
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
    $scope.tableInitialized = false;
    $timeout(function() {

      if (!$.fn.dataTable) return;
      var columnDefinitions = [
        { "sWidth": "20%", aTargets: [0,8]},
        { "sWidth": "15%", aTargets: [4,8]},
        
        { "sWidth": "10%", aTargets: [1,5,6,7]},
        { "sWidth": "5%",  aTargets: [2,3]},
        {
          "targets": [8],
          "orderable": false,
          "createdCell": function(td, cellData, rowData, row, col) {
            var o = rowData[8];
            var actionHtml = '<pdf-download c="\'btn-oval fa fa-ticket mr\'"  title="Download Ticket" url="v1/download/' + contextService.userVenues.selectedVenueNumber + '/pdf/ticket/' + o.id +
              '" filename="ticket-' + o.id + '.pdf"></pdf-download>'+
              '<pdf-download c="\'btn-oval fa fa-file-pdf-o mr\'"  title="Download Receipt" url="v1/download/' + contextService.userVenues.selectedVenueNumber + '/pdf/ticketreceipt/' + o.id +
              '" filename="ticket-receipt' + o.id + '.pdf"></pdf-download>'+
              '<button class="btn btn-default btn-oval fa fa-times" title="Cancel"></button>';
            $(td).html(actionHtml);
            $compile(td)($scope);
          }
        }
      ];

      DataTableService.initDataTable('tickets_table', columnDefinitions, false);
      $scope.tableInitialized = true;
      $scope.readData();
    });
    
    $('#tickets_table').on('click', '.fa-times', function() {
      $scope.cancelTicket(this);
    });
    
    $('#eventDateCalendarId').on('click', function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $timeout(function() {
            $scope.config.opened = !$scope.config.opened;
        }, 200);
    });

    $scope.readData = function () {
      
      if ($scope.tableInitialized === false) {
        return;
      }

      var date = '';
      if ($scope.calendarDate != '') {
        date = moment($scope.calendarDate).format('YYYYMMDD');
      }
      var target = {
        id: contextService.userVenues.selectedVenueNumber,
        date: date
      };

      RestServiceFactory.VenueEventService().getSoldTickets(target, function(data) {
        var table = $('#tickets_table').DataTable();
        table.clear();
        data.map(function(ticketSold) {
          table.row.add([ticketSold.eventName, ticketSold.ticketType, ticketSold.quantity, ticketSold.cost,
           moment(ticketSold.soldDate).format('MMM DD, YYYY HH:mm a'), moment(ticketSold.eventDate).format('MMM DD, YYYY'), 
           ticketSold.orderNumber, ticketSold.contactName, ticketSold]);
        });
        table.draw();
      });
    };
    $scope.$watch('calendarDate',  function() {
        $scope.readData();
    });

    $scope.$on(APP_EVENTS.venueSelectionChange, function(event, data) {
        // register on venue change;
       $scope.readData();
    });

    $scope.cancelTicket = function(button) {
      var table = $('#tickets_table').DataTable();
      var targetRow = $(button).closest("tr");
      var rowData = table.row(targetRow).data();

      DialogService.confirmYesNoReason('Cancel Ticket?', 'Do you really want to cancel this Ticket?', function(data) {
      var target = {id: contextService.userVenues.selectedVenueNumber, ticketId: rowData[8].id, reason: data};
      
      RestServiceFactory.VenueEventService().cancelTicket(target, function(success) {
          table.row(targetRow).remove().draw();
        }, function(error) {
          if (typeof error.data !== 'undefined') {
            toaster.pop('error', "Server Error", error.data.developerMessage);
          }
        });
      });
    };
  }
]);
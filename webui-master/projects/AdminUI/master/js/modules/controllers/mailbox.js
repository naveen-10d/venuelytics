/**=========================================================
 * Module: demo-pagination.js
 * Provides a simple demo for pagination
 =========================================================*/

 App.controller('MailboxController', function($scope, colors, $rootScope) {
 'use strict';
  $scope.folders = [
    {name: 'Inbox', folder: 'all', alert:$rootScope.unreadMessages, icon: "fa-inbox",color: 'success',},
    {name: 'New Requests', folder: 'REQUEST', alert: $rootScope.comfirmedCount, icon: "fa-star",color: 'info' },
    {name: 'Completed', folder: 'COMPLETED', alert: $rootScope.comfirmedCount, icon: "fa-star",color: 'info' },
    {name: 'OnHold', folder: 'ONHOLD', alert: $rootScope.requestCount, icon: "fa-paper-plane-o", color: 'warning'},
    {name: 'Bottle', folder: 'Bottle', alert: $rootScope.bottleCount, icon: "fa-edit", color: 'success'},
    {name: 'Private Events',   folder: 'BanquetHall', alert: $rootScope.banquetHallCount, icon: "fa-diamond",color: 'success'},
    {name: 'Guest List',   folder: 'GuestList', alert: $rootScope.GuestCount, icon: "fa-wpforms",color: 'success'},
   // {name: 'Others', folder: 'trash', alert: 0,  icon: "fa-trash"}
  ];

  $scope.labels = [
    {name: 'REQUEST',    color: 'info'},
    {name: 'CONFIRMED',    color: 'green'},
    {name: 'ONHOLD',  color: 'warning'},
    {name: 'COMPLETED',  color: 'success'},
    {name: 'ASSIGNED',  color: 'pink'},
    {name: 'REJECTED',  color: 'danger'},
     {name: 'CANCELED',  color: 'danger'}
  ];

  $scope.mail = {
    cc: false,
    bcc: false
  };
  // Mailbox editr initial content
  $scope.content = "<p>Type something..</p>";


});

 App.controller('MailFolderController', ['$window','$scope', 'RestServiceFactory', '$stateParams', 'ContextService','$rootScope',
  function( $window, $scope, RestServiceFactory, $stateParams, contextService, $rootScope) {
    'use strict';
    $scope.folder = $stateParams.folder;
    $scope.notifications = [];
    $scope.notificationsList = false;
    $scope.init = function() {

      var target = {id:contextService.userVenues.selectedVenueNumber};
      if ($scope.folder === 'REQUEST' || $scope.folder === 'ONHOLD' || $scope.folder === 'COMPLETED') {
        target.type = $scope.folder;
      } else if ($scope.folder !== 'all'){
        target.serviceType = $scope.folder;
      }
      RestServiceFactory.NotificationService().getActiveNotifications( target ,function(data){
        $scope.notifications = data.notifications;
        if($scope.notifications == ''){
          $scope.notificationsList = true;
        }
        $scope.visitors =[];
        for (var i = 0; i < data.visitors.length; i++){
          var visitor = data.visitors[i];
          $scope.visitors[visitor.id] = visitor;
        }
      });
    };
    $rootScope.getAvatar = function(vid) {
      var visitor = $scope.visitors[vid];
      if (visitor && visitor.profileImageThumbnail) {
        return visitor.profileImageThumbnail;
      } 
      return '';
    };

    $scope.getMailArray = function(value){
      $rootScope.selectedObj = value;
    };

    $scope.getStatusColor = function(status) {
       if (status === 'CONFIRMED') {
        return 'circle-success';
      } else if (status === 'CANCELED') {
        return 'circle-danger';
      } else if(status === 'REQUEST') {
        return 'circle-info';
      } else if(status === 'ASSIGNED') {
        return 'circle-pink';
      } else if(status === 'REJECTED') {
        return 'circle-danger';
      } else if(status === 'COMPLETED') {
        return 'circle-success';
      }
    };

    $scope.init();
  }]);

 App.controller('MailViewController', ['$scope','RestServiceFactory', '$stateParams','$rootScope', 'ContextService',
          function( $scope, RestServiceFactory, $stateParams, $rootScope, contextService) {
    'use strict';
    var target = {id: contextService.userVenues.selectedVenueNumber};
    target.productId = $stateParams.mid;
    RestServiceFactory.NotificationService().getCurrentNotifications(target ,function(data){
      $scope.notifications = data;
      $scope.selectOrderItems = [];
      $scope.profileImage = $scope.notifications.visitorId;
      if ($scope.notifications.serviceType === 'GuestList' && $scope.notifications.vaService.refObjectId > 0){
        target.guestListId = $scope.notifications.vaService.refObjectId;
        RestServiceFactory.VenueService().getGuestList(target, function(guestListData) {
          $scope.notifications.venueGuests = guestListData.venueGuests;
        });
      } 
      angular.forEach($scope.notifications.vaService.order.orderItems, function(value, key) {
        var venueImageId = {
          "orderId": value.orderId,
          "productId":value.productId,
          "productType":value.productType,
          "quantity": value.quantity,
          "totalPrice": value.totalPrice,
          "brand": value.brand,
          "name":value.name,
          "category":value.category,
          "description":value.description
        };
        $scope.selectOrderItems.push(venueImageId);
      });
    });
 }]);
/**=========================================================
 * Module: storeInfo.js
 * smangipudi
 =========================================================*/
 /*jshint bitwise: false*/
 App.controller('LoyaltyController', ['$scope', '$state', '$stateParams',
  'RestServiceFactory', 'toaster',
      function( $scope, $state, $stateParams, RestServiceFactory, toaster) {
'use strict';
 $scope.tabs = [
    {name: 'Membership', content: 'app/views/loyalty/membership-tab.html', icon: 'fa-user-circle-o'},
    {name: 'Wallet', content: 'app/views/loyalty/wallet-tab.html', icon: 'fa-address-book-o'}
   
  ];

}]);
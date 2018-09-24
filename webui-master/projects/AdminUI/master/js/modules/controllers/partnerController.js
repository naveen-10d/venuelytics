App.controller('PartnerController', ['$scope', 'RestServiceFactory', 'Session','toaster', 'ngDialog',
        function($scope, RestServiceFactory, Session, toaster, ngDialog) {
  'use strict';
  $scope.partners = [];
  $scope.mapPartners = [];
  $scope.init = function(){

  	RestServiceFactory.AgencyService().getPartners({id: 0}, function(data) {
  		$scope.partners = data.users;
      for (var i = 0; i < $scope.partners.length; i++) {
        var partner = $scope.partners[i];
        partner.paymentAuthorized = false;
        $scope.mapPartners[partner.id] = partner;
      }
      $scope.getPaymentInfo();
  	});


  };

  $scope.getPaymentInfo = function() {
    RestServiceFactory.AgencyService().getActivePaymentAuths({id: 0}, function(data) {
      
      for (var z = 0; z < data.length ; z++) {
        var partner = $scope.mapPartners[data[z].sourceUserId];
        if (typeof partner !== 'undefined') {
          partner.paymentAuthorized = true;
          partner.paymentProcesses = data[z];
        }

      }
      
    });
  };

  $scope.openPayNow = function(partner) {
    var data = partner.paymentProcesses.businessProcessData;
    var requestData = JSON.parse(data[0].request);
    var data ={};
    var self = $scope;
    data.authorizedAmount = requestData.requestedAmount;
    ngDialog.openConfirm({
      template: 'paymentModelDialog',
      className: 'ngdialog-theme-default',
      data: data,
    }).then(function (value) {   
      self.performPayment(partner, data);
    }, function (reason) {
    //mostly cancelled  
    });
  };

  $scope.performPayment = function(partner, data) {
    var payload = {};
    payload.entityId = partner.paymentProcesses.entityId;
    payload.type = 'PAYMENT_AUTH';
    payload.state = 'PAID';
    payload.data = {};
    payload.data.amountPaid = Number(data.paymentMade);
    payload.data.otpPasscode = Number(data.otpCode);
    payload.data.partnerSecurityCode = data.securityToken;

    RestServiceFactory.AgencyService().performPayment({id: partner.paymentProcesses.id}, payload, function(data) {
      toaster.pop({ type: 'success', body: 'Payment completed successfully.', toasterId: 1000 });
      $scope.$apply(function() {
        partner.paymentAuthorized = false;
      });
    }, function(error) {
       toaster.pop({ type: 'error', body: error.data.message, toasterId: 1000 });
    });
  };
  $scope.validateToken = function(partner){
    var payload = {};
    payload.partnerId = partner.id;
    payload.storeId = 0;

    payload.securityCode = partner.token;
    if (typeof partner.token === 'undefined' || partner.token === '') {
     toaster.pop({ type: 'error', body: 'Enter Security Token', toasterId: 1000 });
     partner.validatedClass = 'fa fa-times-circle text-danger';
    } 

    RestServiceFactory.AgencyService().validatePartner({}, payload, function(data) {
      toaster.pop({ type: 'success', body: 'Successfully validated the Token', toasterId: 1000 });
      partner.validatedClass = 'fa fa-check text-success';
    }, function(e,d) {
       toaster.pop({ type: 'error', body: 'Token validation Failed.', toasterId: 1000 });
       partner.validatedClass = 'fa fa-times-circle text-danger';
    });
    
  };

  $scope.init();
}]);
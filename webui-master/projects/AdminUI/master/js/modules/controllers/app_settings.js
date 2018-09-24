/**=========================================================
 * Module: target_settings.js
 * smangipudi
 =========================================================*/

App.controller('ApplicationSettingsController', ['$scope', 'RestServiceFactory', 'toaster','$rootScope','$log', 
  function($scope,RestServiceFactory, toaster, $rootScope, $log) {
  'use strict';
  
  $scope.appLogo=null;
  
  $scope.islogoChanged=false;
  
  var channelSettings = [ 
                           {"displayName":"Max EMAIL per customer per day:",  "name":"max_emails", "type":"select", "value":"1" },
                           {"displayName":"Max PUSH per customer per day:",  "name":"max_push", "type":"select", "value":"1" },
                           {"displayName":"Max SMS per customer per day:",  "name":"max_sms" , "type":"select", "value":"1"},
                           {"displayName":"Max PASS per customer per day:",  "name":"max_passes", "type":"select", "value":"1" },
                           {"displayName":"Retire Ads/Offers after sending:",  "name":"retire_sends_time_based", "unit": "times" , 
                           "type":"select", "value":"1"},
                          ];

  var timeSettings = [ 
                            {"displayName":"Minimum time gap between 2 Ads, Offers reaching the same customer:",  "name":"time_based_mtbt", 
                            "type":"timegap", "value":"1" },
                            {"displayName":"Do not send anything before:",  "name":"start_time", "type":"timepicker", "value":"09:00"},
                            {"displayName":"Do not send anything after:",  "name":"end_time", "type":"timepicker", "value":"21:00" },
                            {"displayName":"Time Zone:",  "name":"timezone", "type":"timezone", "value":"PST" },
                           ];
 
  var generalSettings = [ 
                      {"displayName":"Enable Eventbrite ",  "name":"eventbrite.enabled", "type":"general", "value":"N" },
                      {"displayName":"Eventbrite API Key", "name":"eventbrite.api.key", "type" :"text", "value":""},
                      {"displayName":"Eventbrite Search Radius", "name":"eventbrite.search.radius", "type" :"text", "value":""},
                      {"displayName":"Eventbrite Categories", "name":"eventbrite.catagories", "type" :"text", "value":""},
                      {"displayName":"Production Server", "name":"prodMode", "type":"text", "value":"N" },
                      {"displayName":"Log SQL Statements", "name":"sql.show", "type":"text", "value":"N" },
                      {"displayName":"SMS Control Set",  "name":"sms.controlset" , "type":"text", "value":""},
                      {"displayName":"GCM API Key (Andriod)",  "name":"gcm_api_key", "type":"text", "value":""},
                      {"displayName":"AWS Access Key",  "name":"aws.accessKeyId", "type":"text", "value":""},
                      {"displayName":"AWS secret",  "name":"aws.secretKey", "type":"text", "value":""},
                      {"displayName":"Email Control Set", "name":"email.controlset", "type" :"text", "value":""},
                      {"displayName":"Email Sink", "name":"email.sink", "type" :"text", "value":""},
                      {"displayName":"Stripe Live Mode", "name":"stripe.live", "type" :"text", "value":""},
                      {"displayName":"Stripe Secret", "name":"stripe.api", "type" :"text", "value":""},
                      
                     ];
  var externalSettings = [ 
                          {"displayName":"APNS Private Certificate",  "name":"apns_certificate", "type":"text", "value":"" },
                          {"displayName":"APNS Passphrase",  "name":"pass_certificate_pass", "type":"text", "value":""},
                          {"displayName":"APNS Certificate Alias",  "name":"pass_certificate_alias", "type":"text", "value":""},
                          {"displayName":"Passbook URL Service:",  "name":"tiny_url_service", "type":"text", "value":""},
                          {"displayName":"IOS Passbook Type Identifier",  "name":"passbook_type_identifier", "type":"text", "value":"" },
                          {"displayName":"IOS Team Identifier",  "name":"ios_team_identifier", "type":"text", "value":"" },
                          {"displayName":"SMS Account Id",  "name":"sms_account_id", "type":"text", "value":"" },
                          {"displayName":"SMS Authentication Token",  "name":"sms_auth_token", "type":"text", "value":"" },
                          {"displayName":"SMS Account Number",  "name":"sms_account_number" , "type":"text", "value":""},
                          {"displayName":"SMS Account Number",  "name":"sms_account_number" , "type":"text", "value":""},
                         
                        ];
  $scope.channelSettings = $.Apputil.makeMap(channelSettings);
  $scope.timeSettings = $.Apputil.makeMap(timeSettings);
  $scope.generalSettings = $.Apputil.makeMap(generalSettings);
  $scope.externalSettings = $.Apputil.makeMap(externalSettings);
  var promise = RestServiceFactory.AppSettingsService().get();
  
  promise.$promise.then(function(data) {
	  
	  for (var itemKey in data){
      if (data.hasOwnProperty(itemKey)) {
  		  var setting =  $scope.channelSettings[itemKey];

  		  if (setting != null && typeof setting !== 'undefined') {
  			  setting.value = data[itemKey];
  			  $scope.channelSettings[itemKey] = setting;
  		  } else if (typeof $scope.timeSettings[itemKey] !== 'undefined'){
  			  setting = $scope.timeSettings[itemKey];
  			  setting.value = data[itemKey];
  		  } else if (typeof  $scope.generalSettings[itemKey] !== 'undefined'){
  			  setting = $scope.generalSettings[itemKey];
  			  setting.value = data[itemKey];
  		  } else if (typeof  $scope.externalSettings[itemKey] !== 'undefined'){
  			  setting = $scope.externalSettings[itemKey];
  			  setting.value = data[itemKey];
  		  }
      }
		  
	  }
	  /*if ($scope.generalSettings.companyLogoUrl.value != "") {
		  $scope.appLogo = $scope.generalSettings.companyLogoUrl.value;
	  }*/
  });
 
  $scope.updateMultiple = function(isValid, data, data1) {
	  $scope.update(isValid, data);
	  $scope.update(isValid, data1);
  };

  $scope.update = function(isValid, data) {
  	if (!isValid) {
  		return;
  	}
  	
  	var arr = {};
  	for (var type in data) {
      if (data.hasOwnProperty(type)) {
  		  arr[type] = data[type].value;
      }
  		/*var obj = {};
  		obj.id = data[type].id;
  		obj.name = data[type].name;
  		obj.value = data[type].value;
  		
  		arr.push(obj);*/
  	}
  	RestServiceFactory.AppSettingsService().save(arr, function(success){
  		
  		$log.log("success: ",data);
		  if($scope.islogoChanged){
			//  $rootScope.$broadcast("onLogoChange",{"url":$scope.generalSettings.companyLogoUrl.value});
			  $scope.islogoChanged=false;
		  }
  		
  	},function(error){
  		if (typeof error.data !== 'undefined') { 
  			toaster.pop('error', "Server Error", error.data.developerMessage);
  		}
  	});
  };
  
  $rootScope.$on("FileUploaded",function(ev, data){
	 
	  if("APP_LOGO"=== data.type){
		  $scope.appLogo=data.url;
		  //$scope.generalSettings.companyLogoUrl.value=data.url;
		  $log.log("App logo has been uploaded!", $scope.generalSettings);
		  $scope.islogoChanged=true;
	  }	  
  });
  
}]);
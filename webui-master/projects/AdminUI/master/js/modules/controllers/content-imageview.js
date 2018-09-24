/**
 * smangipudi
 * ========================================================= 
 * Module:
 * content-imageview.js  for Pinterest view for contents
 * =========================================================
 */

App.controller('ContentImageViewController',  ['$scope','$log','$window','$http','ContextService','$timeout' ,
                                     function ( $scope,$log,$window, $http, ContextService, $timeout) {
    'use strict';
	$scope.promotion=[];
	$scope.promotionsList=[];
	
	var isLoading=false;
	
	var baseUrl = "";
	
	$scope.contentType="ALL";
	$scope.contentState="ALL";
	$scope.contentChannel="ALL";
	$scope.trackMode = false;
	$scope.initTrackMode = function() {
		$scope.contentState="ALL_DEPLOYED"; 
		$scope.trackMode = true;
	}
	$scope.fetchData = function () {

		baseUrl = ContextService.contextName + "/v1/content/filter";
		var filter = {};
		filter.contentState = $scope.contentState;
		filter.contentChannel = $scope.contentChannel;
		filter.contentType = $scope.contentType;
		$http.get(baseUrl, {params: filter}).success(function(data){
			
			loadData(data);	
			
		}).error(function(data){
			$log.log("error data:", data);
		});
	};
	$scope.init=function(){
		$log.log("instore promotion insight controller gets called!");
		
		if ($scope.contentState == "ALL_DEPLOYED") {
			baseUrl =  ContextService.contextName + "/v1/deployedcontent";
		} else {
			baseUrl =  ContextService.contextName + "/v1/content";
		}
		$http.get(baseUrl).success(function(data){
			
			loadData(data);	
			
		}).error(function(data){
			$log.log("error data:", data);
		});

	};
	
	function loadData(data) {
		
		$scope.promotionsList.splice(0, $scope.promotionsList.length);
		if(data.contents && data.contents.length>0){
			var imgUrl = "";
		
			for(var idx=0;idx<data.contents.length;idx++){
				$log.log("Data: ",angular.toJson(data.contents[idx]));
				
				$log.log("Channel Type:",data.contents[idx].targetChannels,data.contents[idx]);
				if(data.contents[idx].images!=undefined && data.contents[idx].images.length > 0){
					for (var imgIdx = 0 ; imgIdx < data.contents[idx].images.length; imgIdx++ ) {
						var imageObj = data.contents[idx].images[imgIdx];
						if (data.contents[idx].targetChannels == 16 && imageObj.imageType == 'PASS'){
							imgUrl = imageObj.url;
						} else if (data.contents[idx].targetChannels == 2 && imageObj.imageType == 'EMAIL') {
							imgUrl = imageObj.url;
						}
					}
					
				} else {
					imgUrl = "";
				}
				$log.log("img data:",imgUrl);
				$log.log("Channel TYpe:",data.contents[idx].targetChannels,data.contents[idx]);
				var obj={
					"id": data.contents[idx].id,
					"contentImgUrl":imgUrl,
					"contentImgCss":"",
					"state": data.contents[idx].state,
					"imageTitle":data.contents[idx].text,
					"promotionCategory":data.contents[idx].longText, 
					"count":data.contents[idx].offerLimit, 
					"overlay":{
						overlayText:data.contents[idx].longText,
						overlayImage:data.contents[idx].imgUrl
					},
					"channelType":data.contents[idx].targetChannels,
					"channelImageType":data.contents[idx].channelImageType,
					"trackMode" : $scope.trackMode
				};
				
				$scope.promotionsList.push(angular.copy(obj));	
				
			}	
			
		};
	}
	//infinite scroll
	angular.element($window).bind("scroll",function(eve){
		//$log.log("scrolling.. window Scroll Top: ", $(window).scrollTop()+" "+ $(document).height()+" "+$(window).height());
		var comparableWH=Math.round($(document).height()-$(window).scrollTop());
		if($(window).height()==comparableWH && !isLoading){
			//$log.log("reached to bottom!");
			
			var randomNum=Math.round(Math.random()*3);
			
		}
	});
	
	$scope.$on('$destroy',function(){
		$log.log("controller is going to be destroyed!");
	});
	
	/**
	 * initializing on load..
	 */
	$scope.init();

}]);

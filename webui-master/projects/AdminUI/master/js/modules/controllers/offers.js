/**
 * smangipudi
 * ========================================================= 
 * Module:
 * access-login.js  for login api
 * =========================================================
 */

App.controller('ContentsController',  ['$scope','$log','$window', 
                                     function ( $scope,$log,$window) {
    'use strict';
	$scope.promotion=[];
	$scope.promotionsList=[];
	
	var isLoading=false;
	
	$scope.init=function(){
		$log.log("instore promotion insight controller gets called!");
		
		var promotionObj = {contentImgUrl:"app/img/bg1.jpg",contentImgCss:"",imageTitle:"Milk product",promotionCategory:"SMS", overlay:{
			overlayText:"French police free hostages from two buildings following a shooting at the headquarters of satirical magazine Charlie Hebdo in Paris.",
			overlayImage:"app/img/bg3.jpg"			
		}};
		
		var promotionObj2 = {contentImgUrl:"app/img/bg2.jpg",contentImgCss:"",imageTitle:"Fish product",promotionCategory:"Passbook"};
		
		var promotionObj3 = {contentImgUrl:"app/img/bg3.jpg",contentImgCss:"",imageTitle:"Meat product",promotionCategory:"Email"};
		
		var promotionObj4  = {contentImgUrl:"app/img/bg4.jpg",contentImgCss:"",imageTitle:"Child product",promotionCategory:"Notification"};
		
		$scope.promotionsList.push(promotionObj);
		
		$scope.promotionsList.push(promotionObj2);
		$scope.promotionsList.push(promotionObj3);
		$scope.promotionsList.push(promotionObj4);
		
		for(var i=0;i<10;i++){
			$scope.promotionsList.push(promotionObj);
		}		
		
	};
	
	//infinite scroll
	angular.element($window).bind("scroll",function(eve){
		//$log.log("scrolling.. window Scroll Top: ", $(window).scrollTop()+" "+ $(document).height()+" "+$(window).height());
		var comparableWH=Math.round($(document).height()-$(window).scrollTop());
		if($(window).height()==comparableWH && !isLoading){
			//$log.log("reached to bottom!");
			
			var randomNum=Math.round(Math.random()*3);
			
			//$log.log("random number is : ", randomNum);
			
			for(var i=0;i<10;i++){
				if(randomNum==1){
					$scope.promotionsList.push({contentImgUrl:"app/img/bg2.jpg",contentImgCss:"",imageTitle:"Fish product",promotionCategory:"Passbook"});
				}
				if(randomNum==2){
					$scope.promotionsList.push({contentImgUrl:"app/img/bg4.jpg",contentImgCss:"",imageTitle:"Child product",promotionCategory:"Notification"});
				}
				if(randomNum==3){
					$scope.promotionsList.push({contentImgUrl:"app/img/bg3.jpg",contentImgCss:"",imageTitle:"Meat product",promotionCategory:"Email"});
				}
			}	
			
			$scope.$apply();
			
			if(isLoading){
				isLoading=false;
			}
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

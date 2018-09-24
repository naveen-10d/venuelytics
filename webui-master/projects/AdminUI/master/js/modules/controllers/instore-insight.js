/**
 * smangipudi
 * ========================================================= 
 * Module:
 * instore-insight.js  for Instore Analytics
 * =========================================================
 */

App.controller('InstoreInsightController',  ['$scope', '$rootScope','$log', 'ContextService','$http',
                                     function ($scope, $rootScope, $log,  contextService, $http) {
    'use strict';
	$scope.instoreCards=[];
	$scope.instoreAchievements=[];
	$scope.stores=[];
	
	$scope.getInStoreInfoInProgress=false;

	$scope.mostShoppedTime={
	};
	
	$scope.reloadCount=0;
	
	$scope.mostShoppedDay = {};
	var WEEKDAYS={};
	WEEKDAYS["Sunday"]= 0;
	WEEKDAYS["Monday"]= 1;
	WEEKDAYS["Tuesday"]= 2;
	WEEKDAYS["Wednesday"]= 3;
	WEEKDAYS["Thursday"]= 4;
	WEEKDAYS["Friday"]= 5;
	WEEKDAYS["Saturday"]= 6;
		
	$scope.traffic={};
	
	$scope.topCompetitorByVisit={};
	
	var colorPalattes = ["rgb(45,137,239)", "rgb(153,180,51)", "rgb(227,162,26)", "rgb(255,196,13)", "rgb(0,171,169)","#f05050", "rgb(135,206,250)"];
	
	$scope.init=function(){
		$log.log("instore insights controller gets called!");
		
		/**
		 * loading all stores
		 */
		
		var baseUrl=contextService.contextName+"/v1/public/venues";
		
		$http.get(baseUrl).success(function(data){
			$log.log("success :", data);
			if(data && data.stores){
				$scope.stores=data.stores;
			}							
		}).error(function(data){
			$log.log("error :", data);				
		});

		$scope.getInstoreData(0);
		
	};
	$scope.dayNameFormatter = function(sparkline, options, fields) {
		return "Thrusday";
	};
	$scope.getInstoreData=function(storeId){
		
		$scope.instoreAchievements=[];
		var baseUrl=contextService.contextName+'/v1/posinsight/shopping/'+storeId;
		
		$log.log("Url:", baseUrl);
		var vIdx = 0;
		$http.get(baseUrl).success(function(data){
			$log.log("Success callback:", data);
			//var data=msT;
			var mostShoppedDay = null;
			var mostShoppedTime = null;	
			$scope.instoreCards=[];
			if(data && data.segmentation){
				for (var pIndex = 0; pIndex <  data.segmentation.length; pIndex++) {
					var selectedPalatte = colorPalattes[pIndex%colorPalattes.length];
					var po = createPDO(selectedPalatte, data.segmentation[pIndex]);
					if (po.id === "mostShoppedDay") {
						mostShoppedDay = data.segmentation[pIndex];
					}
					if (po.id === "mostShoppedTime"){
						mostShoppedTime = data.segmentation[pIndex];
					}
					$scope.instoreCards.push(po); 			  
				}
			}
			/**
			 * setting most shopped day
			 */
			if(mostShoppedDay){
				
				$scope.mostShoppedDay={
						val:mostShoppedDay.label,
						array:[0,0,0,0,0,0,0],
						labels:[]
				};
				if(mostShoppedDay.valueSet){
					for(vIdx = 0; vIdx < mostShoppedDay.valueSet.length; vIdx++){
						var dayIdx = WEEKDAYS[mostShoppedDay.valueSet[vIdx].key];
						if ( dayIdx != null && dayIdx >=0 && dayIdx < 7){
							$scope.mostShoppedDay.array[dayIdx] = mostShoppedDay.valueSet[vIdx].value;
							$scope.mostShoppedDay.labels[dayIdx] = mostShoppedDay.valueSet[vIdx].key;
						}
					}

				}			
			}
			/**
			 * setting most shopped Time
			 */
			if(mostShoppedTime){
				
				$scope.mostShoppedTime={
						val:mostShoppedTime.label,
						array:[0,0,0,0,0,0,0,0],
						labels:[]
				};
				if(mostShoppedTime.valueSet){
					for(vIdx = 0; vIdx < mostShoppedTime.valueSet.length; vIdx++){
						var timeIdx = mostShoppedTime.valueSet[vIdx].key/3;
						if ( timeIdx != null && timeIdx >=0 && timeIdx < 8){
							$scope.mostShoppedTime.array[timeIdx] = mostShoppedTime.valueSet[vIdx].value;
							$scope.mostShoppedTime.labels[timeIdx] = mostShoppedTime.valueSet[vIdx].key;
						}
					}
				}
			}
			
			$scope.reloadCount++;
			
		}).error(function(data){
			$log.log("error callback: ",data);
		});
			

		
		/**
		 *  instore analytics
		 */
		baseUrl=contextService.contextName+"/v1/performance/instore/"+storeId;
		
		$http.get(baseUrl).success(function(data){
			$log.log("success data:", data);		
			var vIdx = 0;	
			/**
			 * setting traffic related data's
			 */
			if(data && data.traffic){
				$scope.traffic = data.traffic;
				$scope.traffic={
						val:data.traffic.label,
						name:data.traffic.name,
						array:[],
						labels:[]
				};
				if(data.traffic.valueSet){
					var len = data.traffic.valueSet.length;
					var offset = 0;
					if (len > 7) {
						offset = len-7;
					} else {
						offset = len-1;
					}
					for(vIdx = 0; vIdx < data.traffic.valueSet.length && vIdx < 7; vIdx++){
						$scope.traffic.array[offset-vIdx] = data.traffic.valueSet[vIdx].value;
						$scope.traffic.labels[vIdx] = data.traffic.valueSet[vIdx].key;
					}
				}
			}
			if(data && data.topCompetitorByVisit){
				$scope.topCompetitorByVisit = data.topCompetitorByVisit;
				$scope.topCompetitorByVisit={
						val:data.topCompetitorByVisit.label,
						name:data.topCompetitorByVisit.name,
						array:[],
						labels:[]
				};
				if(data.topCompetitorByVisit.valueSet){
					for(vIdx = 0; vIdx < data.topCompetitorByVisit.valueSet.length && vIdx < 7; vIdx++){
						$scope.topCompetitorByVisit.array[vIdx] = data.topCompetitorByVisit.valueSet[vIdx].value;
						$scope.topCompetitorByVisit.labels[vIdx] = data.topCompetitorByVisit.valueSet[vIdx].key;
					}
				}
			}
			$scope.getInStoreInfoInProgress=false;
			$scope.reloadCount++;
		}).error(function(data){
			$log.log("error data:", data);
			$scope.getInStoreInfoInProgress=false;
		});
	};
	
	
	$scope.onChangeStore=function(){
		$log.log("Store has been changed!",$scope.store);
		if(!$scope.getInStoreInfoInProgress){
			$scope.getInStoreInfoInProgress=true;
			if($scope.store){
				$scope.getInstoreData($scope.store.storeNumber);
			}else{
				$scope.getInstoreData(0);
			}			
		}		
	};
	
	/**
	 * initializing on load..
	 */
	$scope.init();
	function createPDO( color, dataObject){
		
		var obj={
				id: dataObject.id,
				count: dataObject.value || 0,
				description: dataObject.label,
				link: "#/app/instore-insight",
				linkDescription: dataObject.name,
				contentColorCode : { "color": "#fff", "background-color": color, "border-color": "#cfdbe2"},
				linkColorCode :  { "background-color":"#3a3f51"}
			};
		return obj;
	}
}]);

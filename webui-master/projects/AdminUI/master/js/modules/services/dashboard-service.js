 
App.service("DashboardService", ["$log",function($log) {
	'use strict';	
	var self=this;
	
	//SMS = 1, EMAIL=2, AD = 4, NOTIFICATION =8 and PASS = 16
	
	self.channel=["SMS","EMAIL","AD","NOTIFICATION","PASS"];
	
	self.resolveVisitors=function(data){
		
		var responseObj=[];
		
		var currentDate=new Date();
		$log.log("current Date: ", currentDate);
		
		var limit=12;
		

		var newVisitors={
			label:"New Customers",
			color: "#768294",
			data:[]
		};
		
		var regularVisitors={
			label:"Regular Customers",
			color: "#1f92fe",
			data:[]
		};
		
		for(var i=limit-1;i>=0;i--){
			
			var loopDate=new Date();
			loopDate.setDate(1);
			if(currentDate.getMonth()-i===1){
				loopDate.setMonth(1);
			}else{
				loopDate.setMonth(currentDate.getMonth()-i);
			}
			//$log.log("loop Date:", loopDate, loopDate.toLocaleString("en-US",{month:'long'}), loopDate.getFullYear());
			
			var loopMonth=loopDate.toLocaleString("en-US",{month:'long'});
			var loopYear=loopDate.getFullYear();
			
			if(data && data.allVisitors && data.newVisitors){
			
				var newVisitorsCount=self.findVisitorsCountBasedOnMonth(loopMonth, loopYear, data.newVisitors);
				newVisitors.data.push([loopMonth, newVisitorsCount]);
				
				var allVisitorsCount=self.findVisitorsCountBasedOnMonth(loopMonth, loopYear, data.allVisitors);
				regularVisitors.data.push([loopMonth, allVisitorsCount]);
			}
					
		}		
		
		responseObj.push(newVisitors);
		responseObj.push(regularVisitors);
		$log.log("res obj", responseObj);
		return responseObj;
	};
	
	self.findVisitorsCountBasedOnMonth=function(month, year, newVisitors){
		for(var idx in newVisitors){
			if(month === newVisitors[idx].eventMonth && year === newVisitors[idx].eventYear){
				return newVisitors[idx].eventCount;
			}			
		}
		return 0;
	};
	
	self.resolveBeaconEngagement=function(data){
		var responseObj=[];
		var aisles=[];
		var currentDate=new Date();
		var idx = '';
		$log.log("current Date: ", currentDate);
		
		var limit=12;
		
		if(!data.instoreEngagement){
			return responseObj;
		}
		
		/**
		 * finding aisle
		 */
		for(idx in data.instoreEngagement){
			if(aisles.join(',').indexOf(data.instoreEngagement[idx].aisle)<0){
				responseObj.push({
					"label":data.instoreEngagement[idx].aisle,
					"color": getRandomColor(idx),
					"data": []
				});
				aisles.push(data.instoreEngagement[idx].aisle);
			}
		}
		
		$log.log(angular.toJson(responseObj));
		$log.log(angular.toJson(aisles));
		
		if(responseObj.length>0){

			for(var i=limit-1;i>=0;i--){
				var loopDate=new Date();
				loopDate.setDate(1);
				//$log.log("comp : ",currentDate.getMonth()-i," = ", 1);
				if((currentDate.getMonth()-i)===1){
					//$log.log("true", loopDate);
					loopDate.setMonth(1);
					//$log.log(loopDate);
				}else{
					//$log.log("false");
					loopDate.setMonth(currentDate.getMonth()-i);
				}
				
				$log.log("loop Date:", loopDate, loopDate.toLocaleString("en-US",{month:'long'}),
				 loopDate.getFullYear(),"(",currentDate.getMonth(),"-",i,"=" ,currentDate.getMonth()-i,")");
				
				var loopMonth=loopDate.toLocaleString("en-US",{month:'long'});
				var loopYear=loopDate.getFullYear();
				
				for(idx in responseObj){					
					var count=self.getCountBasedOnMonthAndYearAndAisle(loopYear,loopMonth, responseObj[idx].label, data.instoreEngagement);
					responseObj[idx].data.push([loopMonth, count]);
				}
			}
		}		
		
		$log.log("Res: ", angular.toJson(responseObj));
		
		return responseObj;
	};
	
	self.getCountBasedOnMonthAndYearAndAisle=function(year, month, aisle, array){
		
		for(var idx in array){
			//$log.log("checking ", array[idx].month, array[idx].year, array[idx].aisle," with ", year, month, aisle);
			if(month===array[idx].month && year === array[idx].year && aisle.localeCompare(array[idx].aisle)===0){
				//$log.log("match found!", array[idx].month, array[idx].year);
				return array[idx].count;
			}			
		}
		return 0;
		
	};
	
	
	self.resolveChannelEngagement=function(data){
		var responseObj=[];
		
		for(var idx in data){
			
			var chType='';
			if(data[idx].channelType>2){
				if(data[idx].channelType===4){
					chType=self.channel[2];
				}
				if(data[idx].channelType===8){
					chType=self.channel[3];
				}
				if(data[idx].channelType===16){
					chType=self.channel[4];
				}
				
			}else{
				chType=self.channel[data[idx].channelType-1];
			}
			
			responseObj.push({
				"label": chType,
				"color": getRandomColor(idx),
				"data": data[idx].count
			});		
		}
	
		return responseObj;
	};
	
	self.resolveDeviceEngagement=function(data){
		var responseObj=[];
		
		for(var idx in data){
			responseObj.push({
				"label": data[idx].label,
				"color": getRandomColor(idx),
				"data": data[idx].value
			});		
		}
	
		return responseObj;
	};
	
	self.resolvePromotionKpi=function(data){
		var responseObj=[];
		
		var currentDate=new Date();
		$log.log("current Date: ", currentDate);
		
		var limit=12;
		
		if(!data.created || !data.completed ||!data.sent){
			return responseObj;
		}
		
		var completed={
			"label":"Completed",
			"color":"#5ab1ef",
			"data":[]
		};
		
		var created={
				"label":"Created",
				"color":"#f5994e",
				"data":[]
		};
		
		var sent={
				"label":"Sent",
				"color":"#1D7E0E",
				"data":[]
		};
		
		for(var i=limit-1;i>=0;i--){
					
			var loopDate=new Date();
			loopDate.setDate(1);
			if(currentDate.getMonth()-i===1){
				loopDate.setMonth(1);
			}else{
				loopDate.setMonth(currentDate.getMonth()-i);
			}
			//$log.log("loop Date:", loopDate, loopDate.toLocaleString("en-US",{month:'long'}), loopDate.getFullYear());
			
			var loopMonth=loopDate.toLocaleString("en-US",{month:'long'});
			var loopYear=loopDate.getFullYear();
			
			completed.data.push([loopMonth, self.getPromotionCountBasedOnMonth(loopMonth,data.completed)]);
			created.data.push([loopMonth, self.getPromotionCountBasedOnMonth(loopMonth,data.created)]);
			sent.data.push([loopMonth, self.getPromotionCountBasedOnMonth(loopMonth,data.sent)]);
			
		}
		
		responseObj.push(completed);
		responseObj.push(created);
		responseObj.push(sent);
		
		$log.log("promotion kpi:", angular.toJson(responseObj));
		
		return responseObj;		
	};	
	
	self.getPromotionCountBasedOnMonth=function(month, array){
		for(var idx in array){
			if(month===array[idx].month){
				return array[idx].count;
			}			
		}
		return 0;
	};
	function rainbow(numOfSteps, step) {
	    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). 
	    		//This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
	    // Adam Cole, 2011-Sept-14
	    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	    var r, g, b;
	    var h = step / numOfSteps;
	    var i = ~~(h * 6);
	    var f = h * 6 - i;
	    var q = 1 - f;
	    switch(i % 6){
	        case 0: r = 1, g = f, b = 0; break;
	        case 1: r = q, g = 1, b = 0; break;
	        case 2: r = 0, g = 1, b = f; break;
	        case 3: r = 0, g = q, b = 1; break;
	        case 4: r = f, g = 0, b = 1; break;
	        case 5: r = 1, g = 0, b = q; break;
	    }
	    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
	    return (c);
	}
	function getRandomColor(index) {
		return rainbow(30, (index%5)*5 + index/5);
	}
			
}]);
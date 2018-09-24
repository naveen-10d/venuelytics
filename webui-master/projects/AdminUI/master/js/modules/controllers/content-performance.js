App.controller("ContentPerformanceController",["$scope","$log","$window","$http", 
                   function($scope, $log, $window, $http){
	'use strict';
	var self=$scope;
	
	/**
	 * first row widgets population
	 */
	self.cPerformance={
		totalTargeted:10,
		totalReached:8,
		totalAccepted:7,
		totalRedeemed:5
	};	
	
	
	/**
	 * Demography pie chart data's
	 */
	self.demography=[ { "color" : "#39C558",
	    "data" : 60,
	    "label" : "Men"
	  },
	  { "color" : "#00b4ff",
	    "data" : 90,
	    "label" : "Woman"
	  },
	  { "color" : "#FFBE41",
	    "data" : 50,
	    "label" : "All"
	  }
	];
	
	/**
	 * targetedType pie chart data
	 */
	self.targetedType=[ { "color" : "#ff3e43",
	    "data" : 30,
	    "label" : "Send Now"
	  },
	  { "color" : "#E0E516",
	    "data" : 90,
	    "label" : "Scheduled"
	  },
	  { "color" : "#937fc7",
	    "data" : 20,
	    "label" : "Location Based"
	  }
	];
	
	/**
	 * Targeted Channel pie chart data 
	 */
	self.targetedChannel=[ { "color" : "#ff3e43",
	    "data" : 19,
	    "label" : "SMS"
	  },
	  { "color" : "#E0E516",
	    "data" : 10,
	    "label" : "Passbook"
	  },
	  { "color" : "#937fc7",
	    "data" : 25,
	    "label" : "Email"
	  },
	  { "color": "#1f92fe",
		"data" : 50,
		"label" : "Notification"
	  }
	];
	
	/**
	 * Target or Reached and Redeemed by Time line chart data's
	 */
	self.targetOrReachedByTime=[{
	    "label": "Targeted",
	    "color": "#5ab1ef",
	    "data": [
	        ["Jan", 188],
	        ["Feb", 183],
	        ["Mar", 185],
	        ["Apr", 199],
	        ["May", 190],
	        ["Jun", 194],
	        ["Jul", 194],
	        ["Aug", 184],
	        ["Sep", 74]
	    ]
	}, {
	    "label": "Reached",
	    "color": "#f5994e",
	    "data": [
	        ["Jan", 153],
	        ["Feb", 116],
	        ["Mar", 136],
	        ["Apr", 119],
	        ["May", 148],
	        ["Jun", 133],
	        ["Jul", 118],
	        ["Aug", 161],
	        ["Sep", 59]
	    ]
	}, {
	    "label": "Redeemed",
	    "color": "#d87a80",
	    "data": [
	        ["Jan", 121],
	        ["Feb", 197],
	        ["Mar", 193],
	        ["Apr", 210],
	        ["May", 202],
	        ["Jun", 293],
	        ["Jul", 292],
	        ["Aug", 292],
	        ["Sep", 244]
	    ]
	}];
	
	
	/**
	 * initialization of content performance controller
	 */
	self.init=function(){
		$log.log("content performance controller has been initialized!");
		
		/**
		 * loading demography
		 */
		self.loadDonut('.demography', self.demography);
		/**
		 * loading targeted type
		 */
		self.loadDonut('.targetedType',self.targetedType);
		/**
		 * loading targeted channel
		 */
		self.loadDonut('.targetedChannel', self.targetedChannel);
		/**
		 * loading target-reached-redeemed-by-time 
		 */
		self.loadLineChart('.target-reached-redeemed-by-time', self.targetOrReachedByTime);
		
	};
	
	
	/**
	 * trigger donut chart
	 */
	self.loadDonut=function(className, srcData){
		$log.log("loading demography donut");
		// Donut
	    (function () {
	        var Selector = className;
	        $(Selector).each(function() {
	            //var source = $(this).data('source') || $.error('Donut: No source defined.');
	            var chart = new FlotChart(this, srcData, true),
	                option = {
		            	series: {
		                    pie: {
		                        show: true,
		                        innerRadius:0.5,
		                        radius: 1,
		                        label: {
		                            show: true,
		                            radius: 3/4,
		                            formatter: labelFormatter,
		                           /* background: {
		                                opacity: 0.5,
		                                color: '#000'
		                            }*/
		                        }
		                    }
		                },
		                legend: {
		                    show: true
		                }, 
		                grid: {
	                        hoverable: true,
	                        clickable: true
	                    }
	                };
	            // Send Request
	            chart.requestData(option);
	        });
	    })();
	};
	
	/**
	 * trigger line chart 
	 */
	self.loadLineChart=function(className, srcdata){
		$log.log("loading line chart");
		var Selector = className;
        $(Selector).each(function() {
        	var source=null;
        	if(srcdata){
        		source=srcdata;
        	}else{
        		source = $(this).data('source') || $.error('Line: No source defined.');
        	}
            var chart = new FlotChart(this, source, true),
                option = {
                    series: {
                        lines: {
                            show: true,
                            fill: 0.01
                        },
                        points: {
                            show: true,
                            radius: 4
                        }
                    },
                    grid: {
                        borderColor: '#eee',
                        borderWidth: 1,
                        hoverable: true,
                        backgroundColor: '#fcfcfc'
                    },
                    tooltip: true,
                    tooltipOpts: {
                        content: '%x : %y'
                    },
                    xaxis: {
                        tickColor: '#eee',
                        mode: 'categories'
                    },
                    yaxis: {
                        position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                        tickColor: '#eee',
                        minTickSize: 1
                    },
                    shadowSize: 0
                };
            // Send Request
            chart.requestData(option);
        });
	};
	
	
	
	/**
	 * registering the flot chart in global scope
	 */
	$window.FlotChart = function (element, url, isData) {
	    // Properties
	    this.element = $(element);
	    this.url = url;
	    this.isData=isData;

	    // Public method
	    this.requestData = function (option, method, callback) {
	      var self = this;
	      
	      // support params (option), (option, method, callback) or (option, callback)
	      callback = (method && $.isFunction(method)) ? method : callback;
	      method = (method && typeof method === 'string') ? method : 'POST';

	      self.option = option; // save options

	      if(self.isData){
	    	  $.plot( self.element, self.url, option );
	          
	          if(callback) callback();
	      }else{
		      $http({
		          url:      self.url,
		          cache:    false,
		          method:   method
		      }).success(function (data) {
		          
		          $.plot( self.element, data, option );
		          
		          if(callback) callback();

		      }).error(function(){
		        $.error('Bad chart request.');
		      });
	      }
	      
	      return this; // chain-ability

	    };

	    // Listen to refresh events
	    this.listen = function() {
	      var self = this,
	          chartPanel = this.element.parents('.panel').eq(0);
	      
	      // attach custom event
	      chartPanel.on('panel-refresh', function(event, panel) {
	        // request data and remove spinner when done
	        self.requestData(self.option, function(){
	          panel.removeSpinner();
	        });

	      });

	      return this; // chain-ability
	    };

	};
	
	/**
	 * Label formatter for pie chart
	 */
	function labelFormatter(label, series) {
        return "<div style='font-size:8pt; text-align:center; padding:2px; color:white;'>" + Math.round(series.percent) + "%</div>";
	}
	
	/**
	 * loading init
	 */
	self.init();
	
	
}]);
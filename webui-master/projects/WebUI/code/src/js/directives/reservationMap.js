/**=========================================================
* smangipudi
 * Module: reservationMap.js
*
 =========================================================*/
 app.directive('reservationMap', function(AjaxService) {
    'use strict';
    return {
      restrict: 'EA',
      scope:{
        selectedVenueMap: '=',
        selectTable: '&',
        reservations: '=',
        tableSelection: '='
      },
      link: function(scope,elem,attr){
        
      },
      controller: [ '$scope','$timeout','$compile','APP_COLORS',function ($scope, $timeout, $compile, APP_COLORS) {
        var self = $scope;
        self.reservationData = [];
        angular.forEach(self.reservations, function(obj, key) {
            self.reservationData[obj.productId] = obj;
        });

        
        self.isReserved = function (table) {
            table.reserved = false;
            if (self.reservations && typeof self.reservations !== 'undefined') {
                for (var resIndex = 0; resIndex < self.reservations.length; resIndex++) {
                    if (table.id === self.reservations[resIndex].productId) {
                        table.reserved = true;
                        return true;
                    }
                }
            }
            return false;
        };  

        self.isSelected = function (table) {
            if (self.tableSelection && typeof self.tableSelection !== 'undefined') {
                for (var resIndex = 0; resIndex < self.tableSelection.length; resIndex++) {
                    if (table.id === self.tableSelection[resIndex].id) {
                        return true;
                    }
                }
            }
            return false;
        };
        self.fillColor = function(id) {
            var obj = self.reservationData[id];
            // $log.info("Reservation Data:", angular.toJson(obj));
          // $log.info("tableSelection data:", angular.toJson(self.tableSelection));
          if (self.tableSelection.length !== 0) {
              for (var i = 0; i < self.tableSelection.length; i++) {
                  const obj2 = self.tableSelection[i].id;
                  if (obj2 === id) {
                      // $log.info("Inside yellow");
                      return APP_COLORS.darkYellow;
                  }
              }
              // $log.info("Inside green");
              if (typeof obj === 'undefined') {
                  return APP_COLORS.lightGreen;
              } else {
                  // $log.info("Inside red color");
                  return APP_COLORS.red;
              }
          } else {
              if (typeof obj === 'undefined') {
                  return APP_COLORS.lightGreen;
              } else {
                  // $log.info("Inside red color");
                  return APP_COLORS.red;
              }
          }
        };
        self.strokeColor = function(id) {
            var obj = self.reservationData[id];

            if(self.tableSelection.length !== 0) {
                for(var i = 0; i < self.tableSelection.length; i++) {
                    const obj2 = self.tableSelection[i].id;
                    if(obj2 === id) {
                    // $log.info("Inside yellow");
                    return APP_COLORS.turbo;
                    }
                }
                if (typeof obj === 'undefined') {
                    return APP_COLORS.darkGreen;
                } else {
                    return APP_COLORS.guardsmanRed;
                }
            } else {
                if (typeof obj === 'undefined') {
                    return APP_COLORS.darkGreen;
                } else {
                    return APP_COLORS.guardsmanRed;
                }
            }
        };
        setTimeout(function() {
            $("img[usemap]").rwdImageMaps();
              self.updateVenueMap();
          }, 1000);

      }],
      templateUrl: 'templates/reservation-map.html'
    };
  });
  
  
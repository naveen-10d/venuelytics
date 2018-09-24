/**=========================================================
* smangipudi
 * Module: selectedItems.js
*
 =========================================================*/
app.directive('selectedItems', function() {
  'use strict';
  return {
    restrict: 'E',
    scope:{
      itemList: '=',
      fullItemList: '='
    },
    
    controller: [ '$scope','$timeout','$compile',function ($scope, $timeout, $compile) {

      var self = $scope;
      self.init =function() {

      };

      self.remove = function(index, item) {
        //self.removeItem({index: index, item: item});
        if (self.itemList.length <= 0) {
          return;
        }
        self.itemList.splice(index, 1);
        angular.forEach(self.fullItemList, function (value, key) {
            if (item.id === value.id) {
                value.quantity = 0;
            }
        });
      };
      
      
      self.init();

    }],
    templateUrl: 'templates/selected-items.html'
  };
});

/**=========================================================
* smangipudi
 * Module: tabbedMenu.js
*
 =========================================================*/
app.directive('tabbedMenu', function() {
  'use strict';
  return {
    restrict: 'E',
    scope:{
      heading: '=',
      itemList: '=',
      selectedItems: '=',
      style: '@'
    },
    
    controller: [ '$scope','$timeout','$rootScope','$compile',function ($scope, $timeout, $rootScope, $compile) {

      var self = $scope;
      self.categories = {};
      self.selectedTab = "";
      self.blackTheme = $rootScope.blackTheme;
      self.selectedDDItem = {};
      self.templateUrl = 'templates/menu-items.html';
      if (self.style="dropdown") {
        self.templateUrl = 'templates/menu-items-dropdown.html';
      }
      self.quantityOptions = [{
        quantity: 0,
        label: "Select Quantity"
      }];
      for (var i = 1 ; i <=10; i++ ) {
        var q = {
          quantity : i,
          label: ""+i
        };
        self.quantityOptions.push(q);
      }
      self.init =function() {

        $scope.$watch('itemList', function() {
          console.log("itemlist changed");
          if (self.itemList && self.itemList.length > 0) {
            for(var j=0; j < self.itemList.length; j++) {
              self.itemList[j].quantity = 0;
              self.categories[self.itemList[j].category] = self.itemList[j].category;                     
            }
            self.selectedTab = self.itemList[0].category;
          } else {
            self.categories = {};
          }
        });


      };

      self.isTabSelected = function(tabName) {
        return self.selectedTab === tabName;
      };

      self.selectTab = function(tabName) {
        self.selectedTab = tabName; 
      };
      
      self.selected = function(item) {
        //self.itemSelected({item: item});
        if (!item.id) {
          return;
        }
        var foundItem = self.findItem(item); 

        if (item.quantity !== undefined && item.quantity !== '') {
           
          if (!foundItem) {
            item.quantity = +item.quantity;
            item.total = item.price * item.quantity;
            item.total = item.total.toFixed(2);
            self.selectedItems.push(item);
          } else {
            foundItem.quantity = +item.quantity;
            foundItem.total = foundItem.price * foundItem.quantity;
            foundItem.total = foundItem.total.toFixed(2);
            self.selectedItems.total = foundItem.total;
          }
        }  

        if ((item.quantity === 0) || (item.quantity === '')) {
            var index = self.selectedItems.indexOf(foundItem);
            self.selectedItems.splice(index, 1);
        }
         
      
      };
      
      self.addItem = function() {
        self.selected(self.selectedDDItem.item);
      };
      self.findItem = function(searchItem) {

        for (var i = 0; i < self.selectedItems.length; i++) {
          if (searchItem.id === self.selectedItems[i].id) {
              return self.selectedItems[i];
            }
        }

        return null;
      }
      self.init();

    }],
    templateUrl: function(elem,attrs) {
      self.templateUrl = 'templates/menu-items.html';
      if (attrs.style==="dropdown") {
         self.templateUrl = 'templates/menu-items-dropdown.html';
      }
        return self.templateUrl;
    }
  };
});


/**
 * ========================================================= 
 * Module: venuemap.js
 * smangipudi 
 * =========================================================
 */

App.controller('VenueMapController', ['$scope', '$state','$compile','$timeout', 'RestServiceFactory','DataTableService', 
  'toaster', '$stateParams','ngDialog', function( $scope, $state, $compile, $timeout, RestServiceFactory,
   DataTableService, toaster, $stateParams, ngDialog) {
    'use strict';

    $scope.img = {};
    $scope.img.pic_url = "";
    $scope.mapElements = [];
    $scope.imageUrls = [];
    $scope.img.maps = [];
    $scope.collapse = false;
    $scope.img.containerSelector='#venueMapImg';
    $timeout(function(){

      if ( ! $.fn.dataTable ) return;

      var image = new Image();
      image.onload = function(){
        $scope.originalWidth = this.width;
        $scope.originalHeight = this.height;
        $scope.img.pic_url = this.src;

      };

      $($scope.img.containerSelector).bind('resize', function(){

        if ($scope.displayWidth !== $('#venueMapImg').width() || $scope.displayHeight !== $('#venueMapImg').height()) {
          $scope.displayWidth = $('#venueMapImg').width();
          $scope.displayHeight = $('#venueMapImg').height();
        }
      });

      var columnDefinitions = [
      { sWidth: "15%", aTargets: [0,2] },
      { sWidth: "8%", aTargets: [1,4] },
      { sWidth: "30%", aTargets: [5] },
      { sWidth: "34%", aTargets: [3] },

      {
        "targets": [5],
        "orderable": false,
        "createdCell": function (td, cellData, rowData, row, col) {

          var actionHtml = '<button title="Edit Table" class="btn btn-default btn-oval fa fa-edit"></button>&nbsp;&nbsp;';
          actionHtml += '<button title="Delete Table" class="btn btn-default btn-oval fa fa-trash"></button>';

          $(td).html(actionHtml);
          $compile(td)($scope);
        },
        "render": function (data, type, row, meta ) {
          var actionHtml = '<button title="Edit Table" class="btn btn-default btn-oval fa fa-edit"></button>&nbsp;&nbsp;';
          actionHtml += '<button title="Delete Table" class="btn btn-default btn-oval fa fa-trash"></button>';

          return actionHtml;
        }
      },
                         
      {
        "targets": [4],
        "orderable": false,
      
        "createdCell": function (td, cellData, rowData, row, col) {
          var actionHtml = '<em class="fa fa-check-square-o"></em>';
          if (cellData === false){
            actionHtml = '<em class="fa fa-square-o"></em>';
          }
          $(td).html(actionHtml);
          $compile(td)($scope);
        },
        "render": function (data, type, row, meta ) {
          var actionHtml = '<em class="fa fa-check-square-o"></em>';
          if (row[4] === false){
            actionHtml = '<em class="fa fa-square-o"></em>';
          }
          return actionHtml;
        }
        

    } ];


    DataTableService.initDataTable('tables_table', columnDefinitions, false);
    var table = $('#tables_table').DataTable();
    $('#tables_table').on('click', '.fa-trash',function() {
        $scope.deleteTable(this, table);
    });

    $('#tables_table').on('click', '.fa-edit',function() {
      $scope.editTable(this, table);
    });
    var promise = RestServiceFactory.VenueMapService().getAll({id: $stateParams.venueNumber, type: 'ALL'});
    $scope.venueNumber = $stateParams.venueNumber;
    if($stateParams.id !== ""){
      promise.$promise.then(function(data) {
        data.map(function(venueMap) {
          if (venueMap.id === $stateParams.id) {
            $scope.data = venueMap;
            image.src = venueMap.imageUrls[0].originalUrl;
            $scope.img.maps.splice(0, $scope.img.maps.length);

            var tableMaps = JSON.parse(venueMap.imageMap);
            tableMaps.map(function(t){
              var arc = JSON.parse("["+t.coordinates+"]");
              var coords = [];
              coords[0] = arc[0];
              coords[1] = arc[1]; 
              coords[2] = arc[4];
              coords[3] = arc[5];

              $scope.img.maps.push({
                "editMode" : true,
                "coords": coords,
                "elementName": t.TableName,
                "link_url": "javascript:void(0)"
              });
            });
            table = $('#tables_table').DataTable();
            venueMap.elements.map(function(t) {
              table.row.add([t.name, t.price, t.servingSize, t.description, t.enabled,  t.id, t.imageUrls]);
            });
            table.draw();
          }        
        });      
      });
    }
    
    $scope.addTable = function () {
      $scope.newTable = {};
      $scope.newTable.enabled = 'Y';
      $scope.newTable.price = 0;
      $scope.newTable.description = '';
      $scope.newTable.id = -1;
      $scope.newTable.imageUrls =[];
      ngDialog.openConfirm({
        template: 'app/templates/product/form-table-info.html',
        //plain: true,
        className: 'ngdialog-theme-default',
        scope : $scope 
      }).then(function (value) {
        var table = $('#tables_table').DataTable();
        table.row.add([$scope.newTable.name, $scope.newTable.price || 0, $scope.newTable.servingSize,
        $scope.newTable.description,  $scope.newTable.enabled,   $scope.newTable.id, $scope.newTable.imageUrls]);
        table.page( 'last' ).draw( false );
        _addArea($scope.img, $scope.newTable.name);
        },function(error){

        });    
    };

    function _addArea(img, elementName) {

        if (!img || !img.maps || !angular.isArray(img.maps)) {
          img = angular.isObject(img) ? img : {};
          img.maps = [];
        }
        img.maps.map( function(area) {
          area.editMode = false;
        });
        var calculation = img.getCalculation(),
        lastImg = img.maps.slice(-1)[0],
        lastImgLeft = lastImg ? lastImg.coords[0] : 0,
        lastImgTop = lastImg ? lastImg.coords[1] : 0,
        newImgCoords = [lastImgLeft + 30, lastImgTop + 30, lastImgLeft + 100, lastImgTop + 100];

        if (calculation) {
          img.maps.push({editMode: true, elementName: elementName, coords: calculation.checkCoords(newImgCoords)});
        } else {
          img.maps.push({editMode: true, elementName: elementName, coords: newImgCoords });
        }
    }
    //name, price, capacity, description, enabled, action
    $scope.editTable = function(button, table) {
      var targetRow = $(button).closest("tr");
      var d = table.row( targetRow).data();
      
      $scope.newTable = {};
      $scope.newTable.name = d[0];
      $scope.newTable.price = d[1];
      $scope.newTable.servingSize = d[2];
      $scope.newTable.description = d[3];
      $scope.newTable.enabled = d[4];
      $scope.newTable.id = d[5];
      $scope.newTable.imageUrls = d[6];
      var oldName = d[0];
      ngDialog.openConfirm({
        template: 'app/templates/product/form-table-info.html',
          // plain: true,
          className: 'ngdialog-theme-default',
          scope : $scope 
        }).then(function (value) {
          d[0] = $scope.newTable.name ;
          d[1] = $scope.newTable.price ;
          d[2] = $scope.newTable.servingSize;
          d[3] = $scope.newTable.description;
          d[4] = $scope.newTable.enabled;f
          d[5] = $scope.newTable.id;
          d[6] = $scope.newTable.imageUrls;

          table.row(targetRow).data(d).draw();
          var t = $scope.newTable;
          $scope.renameTableNameInImgMap(oldName, t.name);
        },function(error){

      });
        
    };

    $scope.renameTableNameInImgMap = function(oldName, newTableName) {

      for (var i = 0; i < $scope.img.maps.length; i++) {
        var area = $scope.img.maps[i];
        if (area.elementName === oldName) {
          area.elementName = newTableName;
        }
      }
    }

    $scope.doneEditing = function() {
      if (typeof $scope.img.maps !== 'undefined') {
        $scope.img.maps.map(function(area){
          area.editMode = true;
        });
      }
    };

    $scope.deleteTable = function(button, tableAPI) {

      ngDialog.openConfirm({
        template: 'deletebottletableId',
        className: 'ngdialog-theme-default'
      }).then(function (value) {

        var targetRow = $(button).closest("tr");
        var rowData = tableAPI.row( targetRow).data();
        tableAPI.row(targetRow).remove().draw();
        $scope.syncTablesAndMapElements();

      }, function (reason) {

      });

    };
    
    $scope.createNewVenueMap = function() {
      $state.go('app.venueMapedit', {id: 'new'});
    };


    $scope.$watch('img', function(nVal, oVal){
      $scope.imgJson = angular.toJson(nVal, true);
    }, true);

    $scope.mapFns = {
      getCanSize: function() {
        return [$scope.displayWidth, $scope.displayHeight];
      },
      getImgSize: function(img) {
        return _getImgSize(img.pic_url) || [10, 10];
      },
      removeArea : function(area, index) {
        var table = $('#tables_table').dataTable();
        table.fnDeleteRow(index);
        $scope.syncTablesAndMapElements();
      },

      dragInit : function(area, index) {
        var table = $('#tables_table').DataTable();
        table.$('tr').removeClass('highlight');
        var rowsData = table.rows().data();
        if (area && typeof area !== 'undefined') {
          for (var i = 0 ; i < rowsData.length; i++) {
            if (rowsData[i][0] === area.elementName) {
              table.row( i ).nodes().to$().addClass( 'highlight' ); 
              return;   
            }
          }
        }
      }
    };
    function _getImgSize(url) {

      if (typeof $scope.originalHeight === 'undefined') {
        return false;
      } else {
        return [$scope.originalWidth, $scope.originalHeight];
      }
    }
    
    $scope.syncTablesAndMapElements = function () {
    
      var iMaps = $scope.img.maps;
      var oTable = $('#tables_table').dataTable();
      var tableData  = oTable.fnGetData();

      var tableNames = []
      for(var rIndex = 0; rIndex < tableData.length; rIndex++) {
        tableNames[tableData[rIndex][0]] = 1;
      }
      
      for (var i = iMaps.length - 1; i >= 0; i--) {
        if (tableNames[iMaps[i].elementName] !== 1) {
          iMaps.splice(i,1);
        }
      }
      
        tableNames = [];
        for (i = iMaps.length - 1; i >= 0; i--) {
          tableNames[iMaps[i].elementName] = 1;
        }
        
        for (i = 0; i < tableData.length; i++) {
          if (tableNames[tableData[i][0]] !== 1) {
            iMaps.push({ elementName: tableData[i][0], coords: [50*i, 50*i, 50*i + 50, 50*i+50]});
          }
        } 

    };

    function _addTableElement(data) {
      var eId = data[5];
      
      var element ={
              "id": eId,
              "productType": "VenueMap",
              "category": "category",
              "name": data[0],
              "description": data[3],
              "price": data[1],
              "enabled": "Y",
              "size": data[2],
              "servingSize": data[2],
              "imageUrls": []
            };
      if (eId === -1) {
        delete element.id;
      }
      if (typeof data[6] !== 'undefined') {
        for (var i = 0 ; i < data[6].length; i++) {
          element.imageUrls.push({id: data[6][i].id});
        }
      }      
      return element;
    }

    $scope.update = function(isValid, data, venueNumber) {

      $scope.syncTablesAndMapElements();
      $scope.mapElements = [];
      for (var i = 0; i < $scope.img.maps.length; i++) {
        var coordinates = [];
        var singlePoint = $scope.img.maps[i].coords;
        coordinates[0] = singlePoint[0];
        coordinates[1] = singlePoint[1];
        coordinates[2] = singlePoint[2];
        coordinates[3] = singlePoint[1];
        coordinates[4] = singlePoint[2];
        coordinates[5] = singlePoint[3];
        coordinates[6] = singlePoint[0];
        coordinates[7] = singlePoint[3];
        var splitCoordinates = coordinates.toString();
        var objectMappingDecoupling = { "TableName": $scope.img.maps[i].elementName, "coordinates": splitCoordinates };
        $scope.mapElements.push(objectMappingDecoupling);
      }
      data.imageMap = JSON.stringify($scope.mapElements);
     
      if($scope.imageUrls != ''){
        data.imageUrls = $scope.imageUrls;
        $scope.imageUrls = [];
      }
      angular.forEach(data.imageUrls, function(value, key) {
        var venueImageId = {
          "id" : value.id
        };
       $scope.imageUrls.push(venueImageId);
      });
      data.imageUrls = $scope.imageUrls;
    
      
      var oTable = $('#tables_table').dataTable();
      var tableData  = oTable.fnGetData();

      data.elements = [];
      for(var rIndex = 0; rIndex < tableData.length; rIndex++) {
        data.elements.push(_addTableElement(tableData[rIndex]));
      }
     

      var payload = RestServiceFactory.cleansePayload('VenueMapService', data);
      var target = {id: venueNumber};
   
      RestServiceFactory.VenueMapService().updateVenueMap(target,payload, function(success){
        if(payload.id == success.id){
          ngDialog.openConfirm({
            template: '<p>Your information update successfull</p>',
            plain: true,
            className: 'ngdialog-theme-default'
          });
        } else {
          ngDialog.openConfirm({
            template: '<p>Your information saved successfull</p>',
            plain: true,
            className: 'ngdialog-theme-default'
          });
        }
        $state.go('app.venueedit', {id : venueNumber});
      },function(error){
        if (typeof error.data !== 'undefined') {
          toaster.pop('error', "Server Error", error.data.developerMessage);
        }
      });
    };
    $scope.uploadFile = function(venueImage) {
      var fd = new FormData();
      fd.append("file", venueImage[0]);
      var payload = RestServiceFactory.cleansePayload('venueImage', fd);
      RestServiceFactory.VenueImage().uploadTableImage(payload, function(success){
        if(success !== {}){
          var splitImage = $("#bottleClear").val();
          if(splitImage === ""){
            var t = $scope.newTable;
            t.imageUrls.push(success);
            document.getElementById("clear").value = "";
          } else {
            $scope.img.pic_url = success.originalUrl;
            $scope.originalWidth = success.largeWidth;
            $scope.originalHeight = success.largeHeight;
            $scope.imageUrls.push(success);
            document.getElementById("bottleClear").value = "";
          }
          toaster.pop('success', "Image upload successfull");
        }
      },function(error){
        if (typeof error.data !== 'undefined') {
         toaster.pop('error', "Server Error", error.data.developerMessage);
       }
     });
    };
  });
}]);
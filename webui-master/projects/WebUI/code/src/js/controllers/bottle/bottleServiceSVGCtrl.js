/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('BottleServiceSVGController', ['$log', '$scope', '$location', 'DataShare', '$window', '$routeParams', 'AjaxService', 'APP_ARRAYS', 'APP_COLORS', '$rootScope','ngMeta', 'VenueService', 'toaster','$translate','DialogService',
    function ($log, $scope, $location, DataShare, $window, $routeParams, AjaxService, APP_ARRAYS, APP_COLORS, $rootScope, ngMeta, venueService, toaster, $translate, DialogService) {

        $log.debug('Inside Bottle Service Controller.');


        var self = $scope;
        self.selectionTableItems = [];
            self.bottleCount = 1;
            self.selectedVenueMap = {};
            self.bottleMinimum = [];
            self.availableDays = [];
            self.bottle = {};
            self.bottle.requestedDate = moment().format('YYYY-MM-DD');
            self.chooseBottles = {};
            self.requestMode = true;
            self.siRequired = false;
            self.siLabel = 'reservation.INSTRUCTIONS';
            
            function  noWeekendsOrHolidays(iDate) {
                var DAYNAME = moment(iDate).format("ddd").toUpperCase();
                if(self.venueImageMapData) {
                    var found = false;
                    for (var z = 0; z < self.venueImageMapData.length; z++) {
                        var venueMap = self.venueImageMapData[z];
                        if(venueMap.days === '*' || venueMap.days.indexOf(DAYNAME) !== -1) {
                            found = true;
                            break;
                        }
                        
                    }
                    if(!found) {
                        return false;
                    }
                }


                if (typeof(self.availableDays) === 'undefined' || self.availableDays.length === 0) {
                  return true;
                }
                
                var enabled = false;
                for(var i = 0; i < self.availableDays.length; i++) {
                    const startDate = new Date(self.availableDays[i].startDate.substring(0, 10));
                    const endDate = new Date(self.availableDays[i].endDate.substring(0, 10));
                    const strDate = iDate.getFullYear() + '-' + (iDate.getMonth() + 1) + '-' + iDate.getDate();
                    const date = new Date(strDate);
                    enabled = enabled || (startDate.getTime() <= date.getTime() && endDate.getTime() >= date.getTime());
                }
                return enabled;
            }
            
            self.init = function() {

               
               AjaxService.getVenues($routeParams.venueId,null,null).then(function(response) {
                    self.detailsOfVenue = response;
                    self.venueDetails = response;
                    self.venueId = self.venueDetails.id;
                    venueService.saveVenue($routeParams.venueId, self.venueDetails);
                    venueService.saveVenue(self.venueId, self.venueDetails);

                    ngMeta.setTag('description', response.description + " Bottle Services");
                    $rootScope.title = self.venueDetails.venueName+ " Venuelytics - Bottle Services";
                    ngMeta.setTitle($rootScope.title);
                    angular.forEach(response.imageUrls, function(value,key){
                        ngMeta.setTag('image', value.originalUrl);
                    });
                    self.selectedCity = self.venueDetails.city;
                    self.venueName =    self.detailsOfVenue.venueName;

                    self.initMore();
                    self.$watch('bottle.requestedDate', function() {
                        self.refreshMap();
                    }); 
                });
            };
            self.initMore = function() {
                const date = new Date();
                $rootScope.serviceTabClear = false;
                const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

                if((Object.keys(DataShare.bottleServiceData).length) !== 0) {
                    self.bottle = DataShare.bottleServiceData;
                } else {
                    self.tabClear();
                }
             
                if(DataShare.amount !== '') {
                    self.tabClear();
                } else {
                    self.bottle.authorize = false;
                    self.bottle.agree = false;
                }
             
                if(DataShare.userselectedTables) {
                  self.selectionTableItems = DataShare.userselectedTables;
                }
             
                self.totalGuest = DataShare.totalNoOfGuest;
                if(DataShare.selectBottle) {
                    self.bottleMinimum = DataShare.selectBottle;
                }
             
                if(DataShare.tableSelection) {
                    self.tableSelection = DataShare.tableSelection;
                }
             
                self.reservationTime = APP_ARRAYS.time;
                self.restoreTab = DataShare.tab;
                self.tabParam = $routeParams.tabParam;
                
                self.getMenus();

                self.getEventType();
                
                setTimeout(function() {
                    self.getSelectedTab();
                }, 600);
                
                AjaxService.getVenueMap(self.venueId).then(function(response) {
                    self.venueImageMapData = response.data;
                    $( "#requestDate" ).datepicker('update');

                });

                AjaxService.getVenueServiceOpenDays(self.venueId, 'bottle').then(function(response) {
                  self.availableDays = response.data;
                   $( "#requestDate" ).datepicker({autoclose:true,  orientation: 'bottom', todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd',
                    beforeShowDay: noWeekendsOrHolidays}).on('changeDate', function(ev){
                        console.log("changeDate event");
                        self.bottle.requestedDate = $("#requestDate").val();
                        self.refreshMap();
                    });

                });
               

                AjaxService.getHosts(self.venueId).then(function(response) {
                    self.hostData = response.data;
                });
                self.refreshMap();

            }; 
                       
            self.refreshMap = function() {
              if((self.bottle.requestedDate !== "") || (self.bottle.requestedDate !== undefined)) {
                    self.startDate = moment(self.bottle.requestedDate).format('YYYYMMDD');
                }
                self.showFloorMapByDate();
            }
            self.getBottleProducts = function(productType) {
                AjaxService.getProductsByType(self.venueId, productType).then(function(response) {
                    self.allBottle = response.data;
                });
            };

            self.getSelectedTab = function() {
                $(".service-btn .card").removeClass("tabSelected");
                $("#bottleService > .card").addClass("tabSelected");
            };

            self.tabClear = function() {
                DataShare.bottleServiceData = {};
                DataShare.tableSelection = '';
                DataShare.selectBottle = '';
                self.bottle = {};
                $rootScope.serviceName = '';
                self.bottle.requestedDate = moment().format('YYYY-MM-DD');
            };

            self.getMenus = function() {

                AjaxService.getInfo(self.venueId).then(function(response) {
                    self.bottleMenuUrl = response.data["Bottle.menuUrl"];
                    self.bottleVIPPolicy = response.data["Bottle.BottleVIPPolicy"];
                    self.bottleMinimumRequirement = response.data["Bottle.BottleMinimumrequirements"];
                    self.dressCode =  response.data["Advance.dressCode"];
                    self.enabledPayment =  response.data["Advance.enabledPayment"];
                    self.reservationFee =  response.data["Bottle.BottleReservationFee"];
                    $rootScope.blackTheme = response.data["ui.service.theme"]  || '';
                    self.enableBottleSelection = response.data["Bottle.SpecificServiceBottle.enable"] || 'N';
                    self.siLabel =  response.data["Bottle.siLabel"] || self.siLabel;
                    self.siRequired =  response.data["Bottle.siRequired"] === 'true';
                    if (self.siRequired) {
                        self.siLabel = self.siLabel + '*';
                    }
                    venueService.saveVenueInfo(self.venueId, response);
                    var pInfo = response.data["Bottle.bottleProductInfo"] || { "type":"Bottle", "name":"Bottle List", "min.total.count": 1};
                    var productTypeInfo = { "type":"Bottle", "name":"Bottle List", "min.total.count": 1};
                    if (!pInfo) {
                        productTypeInfo = JSON.parse(pInfo);
                    }

                    self.bottleProductType = productTypeInfo.type;
                    self.bottleProductLabel = productTypeInfo.name;
                    self.bottleProductMinCount = productTypeInfo['min.total.count'] || 0;

                    self.getBottleProducts(self.bottleProductType);
                
                });
            };
            
            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueId, 'Bottle').then(function(response) {
                    self.eventTypes = response.data;
                    if(DataShare.editBottle === 'true') {
                        var selectedType;
                        angular.forEach(self.eventTypes, function(tmpType) {
                        if(tmpType.id === DataShare.bottleServiceData.bottleOccasion.id) {
                          selectedType = tmpType;
                        }
                      });
                      if(selectedType) {
                        self.bottle.bottleOccasion = selectedType;
                      }
                    }
                });
            };

            self.minusValue = function() {
                if(self.bottleCount > 0) {
                self.bottleCount--;
                }
            };

            self.addValue = function() {
                self.bottleCount++;
            };

            self.getBrandByBottleName = function(selectedBottleName) {
                self.chooseBottles.bottleName = selectedBottleName;
                angular.forEach(self.allBottle, function(value, key) {
                if(value.name === selectedBottleName) {
                    self.brandData = [];
                    self.productId =value.id;
                    self.chooseBottles.price = value.price;
                    self.chooseBottles.brandName = value.category;
                    self.brandData.push(value);
                    }
                });
            };

            self.selectedBottles = function() {
                const totalValue = self.chooseBottles.price * self.bottleCount;
                console.log(totalValue);
                const userSelectedBottles = {
                    "price": totalValue,
                    "bottle": self.chooseBottles.bottleName,
                    "brand": self.chooseBottles.brandName,
                    "quantity": self.bottleCount,
                    "productId": self.productId
                };
                self.bottleMinimum.push(userSelectedBottles);
                console.log(self.bottleMinimum);
                self.chooseBottles = {};
                self.bottleCount = 1;
            };

            self.menuUrlSelection = function(bottleMenu) {
                const data = bottleMenu.split(".");
                const splitLength = data.length;
                if(data[0] === "www") {
                    bottleMenu = 'http://' + bottleMenu;
                    $window.open(bottleMenu, '_blank');
                } else if(data[splitLength-1] === "jpg" || data[splitLength-1] === "png") {
                    self.menuImageUrl = bottleMenu;
                    $('#menuModal').modal('show');
                    $('.modal-backdrop').remove();
                } else {
                    $window.open(bottleMenu, '_blank');
                }
            };

            self.showFloorMapByDate = function() {
                if(!DataShare.tableSelection) {
                    self.tableSelection = [];
                    self.selectionTableItems = [];
                }
                
                // Date in YYYYMMDD format
                self.bottleServiceDate = moment(self.startDate).format('YYYYMMDD');
                const day = moment(self.startDate).format('ddd').toUpperCase();

                if(DataShare.selectedDateForBottle !== self.bottleServiceDate) {
                  self.tableSelection = [];
                  self.selectionTableItems = [];
                }

                AjaxService.getVenueMap(self.venueId).then(function(response) {
                    self.venueImageMapData = response.data;
                    DataShare.imageMapping.maps = [];
                    self.selectedVenueMap = {};
                    self.requestMode = true;
                    var selectedDay = moment(self.bottle.requestedDate).format("ddd").toUpperCase();
                    for (var z = 0; z < self.venueImageMapData.length; z++) {
                        var venueMap = self.venueImageMapData[z];
                        self.requestMode = self.requestMode && venueMap.elements.length === 0;
                    }

                    for (var index = 0; index < self.venueImageMapData.length; index++) {
                      var venueMap = self.venueImageMapData[index];
                      DataShare.elements = venueMap.elements;
                      
                      if(venueMap.imageUrls.length !== 0) {
                        // $log.info("imageURl:", angular.toJson(self.venueImageMapData[index].imageUrls[0].originalUrl));
                        DataShare.imageMapping.pictureURL = venueMap.imageUrls[0].originalUrl;
                        DataShare.imageMapping.pictureURLThumbnail = venueMap.imageUrls[0].smallUrl;
                      }

                      if(venueMap.days === '*' || venueMap.days.indexOf(selectedDay) !== -1) {
                        self.selectedVenueMap = venueMap;
                        self.selectedVenueMap.productsByName = [];
                        angular.forEach(venueMap.elements, function(obj, key){
                          self.selectedVenueMap.productsByName[obj.name] = obj;
                        });
                        
                        $("#venueMapSvgImageId").attr("xlink:href", self.selectedVenueMap.imageUrls[0].originalUrl);
                        $("#venueMapSvgImageId").attr("width", self.selectedVenueMap.imageUrls[0].originalWidth);
                        $("#venueMapSvgImageId").attr("height", self.selectedVenueMap.imageUrls[0].originalHeight);
                        var viewBox = "0 0 " + self.selectedVenueMap.imageUrls[0].originalWidth + " " + self.selectedVenueMap.imageUrls[0].originalHeight;
                        $("#venueMapSvg").attr("viewBox", viewBox);
                        
                        var tableMaps = [];
                        if (venueMap.imageMap && venueMap.imageMap.length > 1) {
                           tableMaps = JSON.parse(venueMap.imageMap);
                        }


                          const maps = [];
                          if (!!tableMaps) {
                            tableMaps.map(function(t){
                                const arc = JSON.parse("[" + t.coordinates + "]");
                                const elem = {};
                                elem.name = t.TableName;
                              if (typeof $scope.selectedVenueMap.productsByName[elem.name] !== 'undefined') {
                                elem.id =  $scope.selectedVenueMap.productsByName[elem.name].id;
                                elem.coords = [];
                                elem.coords[0] = arc[0];
                                elem.coords[1] = arc[1];
                                elem.coords[2] = arc[4];
                                elem.coords[3] = arc[5];
                                maps.push(elem);
                              }
                            });
                        }
                        DataShare.imageMapping.maps = maps;
                        
                        self.selectedVenueMap.coordinates = maps;
                        break;
                      }

                    }
                });
                $scope.reservationData = [];
                AjaxService.getVenueMapForADate(self.venueId,self.bottleServiceDate).then(function(response) {
                    self.reservations = response.data;
                    // $log.info("response:", angular.toJson(response));
                    angular.forEach(self.reservations, function(obj, key) {
                      $scope.reservationData[obj.productId] = obj;
                    });
                });
            };

            self.fillColor = function(id) {
                var iOS = /iPad|iPhone|iPod|safari|Mac OS/i.test($window.navigator.userAgent);
                console.log($window.navigator.userAgent);
                var tableObj = $scope.reservationData[id];
                if (tableObj) {
                    return iOS ? '#'+APP_COLORS.red : "url(#redGradient)";
                }
                
                for (var i = 0; i < self.tableSelection.length; i++) {
                  if (self.tableSelection[i].id === id) {
                      return iOS ? '#'+APP_COLORS.darkYellow : "url(#yellowGradient)";
                  }
                }
               
              return  iOS ? '#'+APP_COLORS.lightGreen : "url(#greenGradient)";
            };
            self.strokeColor = function(id) {
                var tableObj = $scope.reservationData[id];
                if (tableObj) {
                    return APP_COLORS.guardsmanRed;
                }
               
                for(var i = 0; i < self.tableSelection.length; i++) {
                  if(self.tableSelection[i].id === id) {
                    return APP_COLORS.turbo;
                  }
                }
                return APP_COLORS.darkGreen;
            };

        self.selectTableForWithOutFloorMap = function(data,index) {
            if (self.selectionTableItems.indexOf(data) === -1) {
                if (data.imageUrls && data.imageUrls.length > 0) {
                    data.imageUrls[0].active = 'active';
                }
                self.selectionTableItems.push(data);
            } else {
                self.selectionTableItems.splice(index,1);
            }
            self.tableSelection = [];

            for (var itemIndex = 0; itemIndex < self.selectionTableItems.length; itemIndex++) {
                const table = {
                    "id": self.selectionTableItems[itemIndex].id,
                    "productType": self.selectionTableItems[itemIndex].productType,
                    "name": self.selectionTableItems[itemIndex].name,
                    "size": self.selectionTableItems[itemIndex].size,
                    "imageUrls": self.selectionTableItems[itemIndex].imageUrls,
                    "description": self.selectionTableItems[itemIndex].description,
                    "minimumRequirement": self.selectionTableItems[itemIndex].minimumRequirement
                };
                self.tableSelection.push(table);
              }
        };

        self.closeModal = function() {
          $('#tableSelectionModal').modal('hide');
        };

        self.closeMoreTableModal = function() {
          $('#moreTableModal').modal('hide');
        };

        self.closeReservedModal = function() {
          $('#reservedTable').modal('hide');
        };

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
        self.getHostImage = function () {
            if (self.bottle.host && self.bottle.host.profileImage){
                return self.bottle.host.profileImage;
            }
            return "";
        };
        self.selectTableSvg = function(id, name) {
            const dataValueObj = self.selectedVenueMap.productsByName[name];
           
            var obj = $scope.reservationData[id];
            if (obj) {
                $('#reservedTable').modal('show');
                $('.modal-backdrop').remove();
                return;
            }
            var index = self.selectionTableItems.indexOf(dataValueObj);
            if (index !== -1) {
                self.selectionTableItems.splice(index,1);
                self.tableSelection.splice(index,1);
                return;
            }

            if (typeof dataValueObj.imageUrls !== 'undefined' && dataValueObj.imageUrls.length > 0) {
                  dataValueObj.imageUrls[0].active = 'active';
            }
            self.selectionTableItems.push(dataValueObj);
          
            DataShare.userselectedTables = self.selectionTableItems;

            self.tableSelection = [];
            for (var itemIndex = 0; itemIndex < self.selectionTableItems.length; itemIndex++) {
                const table = {
                    "id": self.selectionTableItems[itemIndex].id,
                    "productType": self.selectionTableItems[itemIndex].productType,
                    "name": self.selectionTableItems[itemIndex].name,
                    "size": self.selectionTableItems[itemIndex].size,
                    "price": self.selectionTableItems[itemIndex].price,
                    "imageUrls": self.selectionTableItems[itemIndex].imageUrls,
                    "description": self.selectionTableItems[itemIndex].description,
                    "minimumRequirement": self.selectionTableItems[itemIndex].minimumRequirement
                };
                self.tableSelection.push(table);
            }
            
            self.sum = 0;
            self.price = 0;
            for (var i = 0; i < $scope.tableSelection.length; i++) {
              self.sum += $scope.tableSelection[i].size;
              self.price += $scope.tableSelection[i].price;
            }

            $('#tableSelectionModal').modal('show');
            $('.modal-backdrop').remove();

        };
        

        self.removeSelectedTables = function(index,tableObj,selectedTableList) {
            
            selectedTableList.splice(index, 1);
            self.selectionTableItems.splice(index, 1);
        };

        self.confirmBottleService = function() {


            if(!self.requestMode && $scope.tableSelection.length === 0) {
                toaster.pop({ type: 'error', title: 'Bottle Service - Table Selection Error', body: $translate.instant("reservation.FLOOR_MAP_SELECTION"), timeout: 3000});
                return;
            }

            if (!!self.bottleMinimum < self.bottleProductMinCount) {
                var body = 'Please select atleast '+ self.bottleProductMinCount + ' ' + self.bottleProductLabel;
                toaster.pop({ type: 'error', title: 'Bottle Service - Minimum Requirement Error', body: body, timeout: 3000});
                return;
            }
            DataShare.editBottle = 'true';
            $rootScope.serviceTabClear = true;

            const dateValue = self.bottle.requestedDate + 'T00:00:00';

            DataShare.selectedDateForBottle = self.bottleServiceDate;
            const fullName = self.bottle.userFirstName + " " + self.bottle.userLastName;
            const authBase64Str = window.btoa(fullName + ':' + self.bottle.email + ':' + self.bottle.mobile);

            self.sum = 0;
            self.price = 0;
            for (var i = 0; i < $scope.tableSelection.length; i++) {
              self.sum += $scope.tableSelection[i].size;
              self.price += $scope.tableSelection[i].price;
            }
            
            DataShare.bottleServiceData = self.bottle;
            DataShare.bottleZip = self.bottle.bottleZipcode;
            DataShare.selectBottle = self.bottleMinimum;
            DataShare.tableSelection = self.tableSelection;
            
           

            if (self.sum !== 0) {
              if(self.bottle.totalGuest > self.sum) {
                  $('#moreTableModal').modal('show');
                  $('.modal-backdrop').remove();
                  return;
              }
            }
            DataShare.count = self.sum;
            DataShare.price = self.price;
            self.serviceJSON = {
                "serviceType": 'Bottle',
                "venueNumber": self.venueId,
                "reason": self.bottle.bottleOccasion.name,
                "contactNumber": self.bottle.mobile,
                "contactEmail": self.bottle.email,
                "contactZipcode": self.bottle.bottleZipcode,
                "noOfGuests": parseInt(self.bottle.totalGuest),
                "noOfMaleGuests": 0,
                "noOfFemaleGuests": 0,
                "budget": 0,
                "serviceInstructions": self.bottle.instructions,
                "status": "REQUEST",
                "fulfillmentDate": dateValue,
                "durationInMinutes": 0,
                "deliveryType": "Pickup",
                "order": {
                    "venueNumber": self.venueId,
                    "orderDate": dateValue,
                    "orderItems": []
                },
                "prebooking": false,
                "employeeName": "",
                "visitorName": fullName
            };  

            if (self.tableSelection !== undefined) {
                angular.forEach(self.tableSelection, function(value, key) {
                    const items = {
                        "venueNumber": self.venueId,
                        "productId": value.id,
                        "productType": value.productType,
                        "quantity": value.size,
                        "comments": value.comments,
                        "name": value.name,
                        "totalPrice": value.price
                    };
                    self.serviceJSON.order.orderItems.push(items);
                });
            }

            if (self.bottleMinimum !== undefined) {
                angular.forEach(self.bottleMinimum, function(value1, key1) {
                    const items = {
                        "venueNumber": self.venueId,
                        "productId": value1.id,
                        "productType": self.bottleProductType,
                        "quantity": value1.quantity,
                        "name": value1.name
                    };
                    self.serviceJSON.order.orderItems.push(items);
                });
            }
             AjaxService.validateOrder(self.venueId, self.serviceJSON).then( function(response) {
                 if (response.status == 200 ||  response.status == 201) {
                    DataShare.payloadObject = self.serviceJSON;
                    DataShare.enablePayment = self.enabledPayment;
                    $location.url( self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirm");
                } else {
                    if (response.data && response.data.message) {
                        DialogService.showError('Order Validation Failed', response.data.message);
                        return;
                    }
                    DialogService.showError('Order Validation Failed', 'Unable to validate the order.');
                    return;
                }
             });
           
        };

        self.venueRefId = function(venue) {
          if (!venue.uniqueName) {
              return venue.id;
          } else {
              return venue.uniqueName;
          }
        };
        
        self.init();
        self.scrollToTop($window);
    }]);

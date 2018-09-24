/**
 * @author Saravanakumar K
 * @date 19-MAY-2017
 */
"use strict";
app.controller('GuestListController', ['$log', '$scope', '$location', 'DataShare', '$routeParams', 'AjaxService', '$rootScope','ngMeta', 'VenueService', '$timeout',
    function ($log, $scope, $location, DataShare,  $routeParams, AjaxService,  $rootScope, ngMeta, venueService, $timeout) {

    		$log.log('Inside GuestList Controller.');

            var self = $scope;
            self.guest = {firstName: '', lastName: ''};

            self.guestMemberList = [];

            self.member = {};
            self.guestListFields = false;
            //self.guestMemberList.push(obj);
            self.siRequired = false;
            self.siLabel = 'reservation.INSTRUCTIONS';
            self.firstNameLabel = 'reservation.FIRST_NAME';

            self.init = function() {

                
                self.venueDetails = venueService.getVenue($routeParams.venueId);
                self.venueId = self.venueDetails.id;
                self.venueInfo();
                ngMeta.setTag('description', self.venueDetails.description + " Guest List");
                $rootScope.title = self.venueDetails.venueName+ " Venuelytics - Guest List";
                ngMeta.setTitle($rootScope.title);

                var date = new Date();
                var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                $rootScope.serviceTabClear = false;
                $("#requestedDate").datepicker({autoclose:true,  orientation: 'bottom', todayHighlight: true, startDate: today, minDate: 0, format: 'yyyy-mm-dd'});
                if((Object.keys(DataShare.guestListData).length) !== 0) {
                    self.guest = DataShare.guestListData;
                    self.guestMemberList = self.guest.guestMemberList;
                } else {
                    self.tabClear();
                }
                if($rootScope.serviceName === 'GuestList') {
                    self.tabClear();
                }
                self.getEventType();
                setTimeout(function() {
                        self.getSelectedTab();
                    }, 600);
            };


            self.tabClear = function() {
                DataShare.guestListData = {};
                $rootScope.serviceName = '';
                self.guest = {};
                self.guest.requestedDate = moment().format('YYYY-MM-DD');
            };

            self.venueInfo = function() {
                var fields = venueService.getVenueInfo(self.venueId, 'GuestList.ui.fields');
                if (typeof(fields) !== 'undefined') {
                    self.guestListFields = JSON.parse(fields) ;
                } 
                self.siLabel =  venueService.getVenueInfo(self.venueId, 'GuestList.siLabel') || self.siLabel;
                self.siRequired = venueService.getVenueInfo(self.venueId, 'GuestList.siRequired') === 'true';
                self.auditionType = venueService.getVenueInfo(self.venueId, 'GuestList.audition') === 'true';
                if (self.siRequired) {
                    self.siLabel = self.siLabel + '*';
                }
                if (self.guestListFields && self.has('ORGANIZER_FIRST_NAME')) {
                    self.firstNameLabel = self.guestListFields['ORGANIZER_FIRST_NAME'];
                }
                
            };

            self.has = function(elementName) {
                if (!self.guestListFields) {
                    return true;
                }
                return self.guestListFields && self.guestListFields.hasOwnProperty(elementName);
            };
            self.getEventType = function() {
                AjaxService.getTypeOfEvents(self.venueId, 'GuestList').then(function(response) {
                    self.eventTypes = response.data;
                      
                    var selectedType;
                    angular.forEach(self.eventTypes, function(tmpType) {
                        if( typeof(DataShare.guestListData) !=='undefined' && typeof(DataShare.guestListData.guestEvent) !== 'undefined' && tmpType.id === DataShare.guestListData.guestEvent.id) {
                            selectedType = tmpType;
                        }
                    });
                    if(selectedType) {
                        self.guest.guestEvent = selectedType;
                        $log.info("Inside datashare", angular.toJson(self.guest.guestEvent));
                    }
                    
                });
            };

            self.getSelectedTab = function() {
                $(".service-btn .card").removeClass("tabSelected");
                $("#guestList .card").addClass("tabSelected");
            };

            self.addMember = function(member) {
                if (typeof(member.guestName) !== 'undefined' && member.guestName.length > 0) {
                    self.guestMemberList.push(member);
                    self.member = {};
                }
                
            };
            self.hashCode = function(str, asString, seed) {
                /*jshint bitwise:false */
                var i, l,
                    hval = (seed === undefined) ? 0x811c9dc5 : seed;

                for (i = 0, l = str.length; i < l; i++) {
                    hval ^= str.charCodeAt(i);
                    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
                }
                if( asString ){
                    // Convert to 8 digit hex string
                    return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
                }
                return hval >>> 0;
            };
            self.glistSave = function(guest) {
                guest.guestEvent = guest.guestEvent  || {};
                
                DataShare.tab = 'G';
               
                $rootScope.serviceTabClear = true;
                guest.lastName = guest.lastName || '';
                var name = guest.firstName + ' ' + guest.lastName;
                name = name.trim();
                guest.userType = 'VISITOR';
                 if (self.auditionType) {
                    guest.guestEmailId = name + '@' + self.hashCode(guest.instructions, true);
                    guest.guestMobileNumber = '0000000000' ;
                    guest.totalGuest = 1;
                    guest.guestEvent.name = "ALL";
                }
                var authBase64Str = window.btoa(name + ':' + guest.guestEmailId + ':' + guest.guestMobileNumber);
               
                var dateValue = moment(self.guest.requestedDate, 'YYYY-MM-DD').format("YYYY-MM-DDTHH:mm:ss");
                
                guest.guestMemberList  = self.guestMemberList;

                // this is a hack for 170955 till we find a new home for auditions service
               
                var object = {
                     "venueNumber" : self.venueId,
                     "email" :      guest.guestEmailId,
                     "phone" :      guest.guestMobileNumber,
                     "zip" :        guest.guestZip,
                     "eventDay" :   dateValue,
                     "totalCount" : guest.totalGuest,
                     "maleCount" :  guest.guestMen,
                     "femaleCount" : guest.guestWomen,
                     "eventName" :  guest.guestEvent.name,
                     "venueGuests" : guest.guestMemberList,
                     "userType": guest.userType,
                     "visitorName": name,
                     "serviceInstructions": guest.instructions

                };
                DataShare.guestListData = self.guest;
                DataShare.authBase64Str = authBase64Str;
                DataShare.payloadObject = object;
                self.guest.authorize = false;
                self.guest.agree = false;
                $location.url( self.selectedCity + "/" + self.venueRefId(self.venueDetails) + "/confirmGuestList");
            };

            self.venueRefId = function(venue) {
                if (!venue.uniqueName) {
                    return venue.id;
                } else {
                    return venue.uniqueName;
                }
            };
            self.init();
    }]);

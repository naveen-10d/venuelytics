"use strict";
app.controller('AttractionsDetailsController', ['$log', '$scope', '$http', '$location', 'RestURL', 'DataShare', '$window', '$routeParams', 'AjaxService', '$rootScope', 'VenueService',
    function ($log, $scope, $http, $location, RestURL, DataShare, $window, $routeParams, AjaxService, $rootScope, venueService) {

        $log.log('Inside Attractions Details Controller.');

        var self = $scope;
        $rootScope.venueTotalHours = [];

        self.init = function () {

            AjaxService.getVenues($routeParams.venueId, null, null).then(function (response) {
                self.detailsOfAttractions = response;
                self.venueId = self.detailsOfAttractions.id;
                venueService.saveVenue($routeParams.venueId, response);
                venueService.saveVenue(self.venueId, response);
                $rootScope.description = self.detailsOfAttractions.description;
                self.selectedCity = self.detailsOfAttractions.city;
                self.venueName = $rootScope.headerVenueName = self.detailsOfAttractions.venueName;
                $rootScope.headerAddress = self.detailsOfAttractions.address;
                $rootScope.headerWebsite = self.detailsOfAttractions.website;
                self.imageParam = 'Y';//$location.search().i;
                self.detailsOfAttractions.imageUrls[0].active = 'active';
                self.venueImage = self.detailsOfAttractions.imageUrls[0];
                setTimeout(function () {
                    self.initMore();
                }, 10);
            });
        };
        
        self.initMore = function () {
            venueService.saveProperty(self.venueId, 'embed', $rootScope.embeddedFlag);
            self.getServiceTime();
            self.updateSelection(0)
            AjaxService.getCategories(self.venueId, 'attractions', 'ATTRACTION').then(function(response) {
                self.attractionsCategories = response.data;
                self.attractionsCategories.push({name: "ALL", value: 0});
            });
        };
        self.updateSelection = function (filterValue) {
            AjaxService.nearBy(self.venueId, 'attraction', filterValue).then(function (response) {
                self.listOfAttractions = response.data;
            });
        };
        self.getServiceTime = function () {
            var reservationTime;
            var date = new Date();
            $scope.startDate = moment(date).format("MM-DD-YYYY");
            AjaxService.getServiceTime(self.venueId, 'venue').then(function (response) {
                reservationTime = response.data;
                angular.forEach(reservationTime, function (value, key) {
                    $scope.venueOpenTime = new Date(moment($scope.startDate + ' ' + value.startTime, 'MM-DD-YYYY h:mm').format());
                    var startDateValue = moment($scope.venueOpenTime).format("HH:mm a");
                    var H = + startDateValue.substr(0, 2);
                    var h = (H % 12) || 12;
                    var ampm = H < 12 ? " AM" : " PM";
                    value.sTime = h + startDateValue.substr(2, 3) + ampm;
                    $scope.venueCloseTime = new Date(moment($scope.startDate + ' ' + value.endTime, 'MM-DD-YYYY h:mm').format());
                    var endDateValue = moment($scope.venueCloseTime).format("HH:mm a");
                    H = + endDateValue.substr(0, 2);
                    h = (H % 12) || 12;
                    ampm = H < 12 ? " AM" : " PM";
                    value.eTime = h + endDateValue.substr(2, 3) + ampm;
                    $rootScope.venueTotalHours.push(value);
                });
                self.venueTimeFormatted();
            });
        };

        self.venueTimeFormatted = function () {

            /*if (!!self.venueTotalHours && self.venueTotalHours.length == 1 && self.venueTotalHours[0].sTime === self.venueTotalHours[0].eTime) {
                return "Open 24 Hours";
            }*/
            var dayRangeTimings = {};
            var DAY_SEQUENCE = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            for (var i = 0; i < self.venueTotalHours.length; i++) {
                /*if (i > 0 && i < self.venueTotalHours.length - 1) {
                    venueTime += ', ';
                } else if (i > 0 && i === self.venueTotalHours.length - 1) {
                    venueTime += ' and ';
                }               
                venueTime += self.venueTotalHours[i].sTime + " - " + self.venueTotalHours[i].eTime;
                */
                if (self.venueTotalHours[i].day === "*") {
                    var range = "Sunday - Saturday";
                    addToRange(dayRangeTimings, range, self.venueTotalHours[i]);
                } else {
                    var individualDays = self.venueTotalHours[i].day.split(",");

                    var startDay = individualDays[0];
                    var startDayIndex = DAY_SEQUENCE.indexOf(startDay);
                    var nextIndex = startDayIndex + 1;
                    var range = DAY_NAMES[startDayIndex];
                    for (var sIndex = 1; sIndex < individualDays.length; sIndex++) {
                        var nextDay = individualDays[sIndex];
                        var nIndex = DAY_SEQUENCE.indexOf(nextDay, startDayIndex);
                        if (nIndex === nextIndex && sIndex !== individualDays.length - 1) {
                            nextIndex++;
                            continue;
                        } else if (nIndex === nextIndex && sIndex === individualDays.length - 1) {
                            range += ' - ' + DAY_NAMES[nextIndex];
                            addToRange(dayRangeTimings, range, self.venueTotalHours[i]);
                            range = '';
                        } else if (sIndex === individualDays.length - 1) {
                            if (range === '') {
                                range = DAY_NAMES[--nextIndex];
                            } else {
                                range += ' - ' + DAY_NAMES[--nextIndex];
                            }

                            addToRange(dayRangeTimings, range, self.venueTotalHours[i]);
                            range = DAY_NAMES[nIndex];
                            addToRange(dayRangeTimings, range, self.venueTotalHours[i]);
                        }
                        else {
                            if (range === '') {
                                range = DAY_NAMES[--nextIndex];
                            } else {
                                range += ' - ' + DAY_NAMES[--nextIndex];
                            }

                            addToRange(dayRangeTimings, range, self.venueTotalHours[i]);
                            range = DAY_NAMES[++nextIndex];;
                        }
                    }
                }
            }
            self.venueTimes = dayRangeTimings;
        };

        self.AttractionsRefId = function (attraction) {
            if (!attraction.uniqueName) {
                return attraction.id;
            } else {
                return attraction.uniqueName;
            }
        }

        self.getAttractionsDetailUrl = function (attraction) {
            self.attractionSelectedCity = attraction.city;
            var q = "";
            if ($rootScope.embeddedFlag) {
                q = "?embeded=Y";
            }
            return '/attraction/' + self.attractionSelectedCity + '/' + self.AttractionsRefId(attraction) + q;
        }

        function formatTimeAsRange(serviceHour) {

            if (serviceHour.sTime === serviceHour.eTime) {
                return "Open 24 Hours";
            }
            return serviceHour.sTime + " - " + serviceHour.eTime;
        }

        function addToRange(dayRangeTimings, range, serviceHour) {
            var value = dayRangeTimings[range];
            if (!value) {
                dayRangeTimings[range] = formatTimeAsRange(serviceHour);
            } else {
                dayRangeTimings[range] = dayRangeTimings[range] + ' & ' + formatTimeAsRange(serviceHour);
            }
        }

        self.init();
    }]);
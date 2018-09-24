"use strict";
const moment = require("moment");
const pluralize = require('pluralize');
function hasParam(response, name, value) {
    if (response && response.parameters) {
        let nameValue = response.parameters[name];
        if (!!value) {
            
            if (nameValue && Array.isArray(nameValue)) {
                return nameValue.indexOf(value) > -1;
            } else {
                return nameValue && (nameValue.toLowerCase() === value || nameValue.toLowerCase().indexOf(value) > -1);
            }
        } else {
            return nameValue && nameValue.length > 0;    
        }
    }
    return false;
}

function capitalizeFirstLetter(string) {
    if(isNotEmpty(string)) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 
    return "";
}
function formatTime(normalizedTime) {
    // Check correct time format and split into components
    
      let time = normalizedTime;
      if (time.length < 5) {
        time += '0';
      }
      let hms = time.split(':');
      
      let h = +hms[0];
      let suffix = (h < 12) ? ' AM' : ' PM';
      hms[0] = h % 12 || 12;        
      return hms.join(':') + suffix;
  }
  
  function isBetween(timeStr, startTime, endTime, tz) {
   
    // var time = moment() gives you current time. no format required.
    let time = moment(timeStr,'hh:mm:ss'),
    beforeTime = moment(startTime, 'hh:mm a'),
    afterTime = moment(endTime, 'hh:mm a');
    if (tz) {
        time.tz(tz);
        beforeTime.tz(tz);
        afterTime.tz(tz);

    }
    return time.isBetween(beforeTime, afterTime);
}

function facilityCost(obj, facilityInfo) {
    let itemName = _itemName(obj);
    let m = getFacility(itemName, facilityInfo);
    if (m) {
        if (m.costText) {
            return m.costText;
        } else if (!m.present) {
            return `Sorry, we don't have ${itemName}`;
        } else if (m.text && (m.text.search(/free/i) > -1 || m.text.search(/complimentary/i) > -1 || m.text.search(/complementary/i) > -1)) {
            return `It is free`;
        }
    }
    return null;   
}
function _itemName(obj) {
    let itemName =  null;
    if (Array.isArray(obj) && obj.length > 0) {
        itemName = obj[0];
    } else if(!Array.isArray(obj)) {
        itemName = obj;
    }
    return itemName;
}

function getFacility(itemName, facilityInfo) {
    if (itemName) {
        let m = facilityInfo[itemName.toUpperCase()];
        if (!m) {
            for (let key in facilityInfo) {
                if(facilityInfo.hasOwnProperty(key)) {
                    let fi = facilityInfo[key]; 
                    if (fi.commonName.indexOf(itemName.toUpperCase()) > -1){
                        m = fi;
                        break;
                    }   
                }   
            }
        }
        return m;
    }
    return null;
}
function facilityValue(obj, facilityInfo) {
    let itemName = _itemName(obj);
    let m = getFacility(itemName, facilityInfo);
    if (m) {
        if (m.text) {
            return m.text;
        } else if (m.present === 'Y') {
            return `Yes, we do provide ${itemName}`;
        } else if (m.present === 'N') {
            return `No, It is not available.`;
        }
    }
    return null;   
}

function getFacilityObjectFromResponse(facilityType, facilityInfo, response) {


    let dataObj = facilityInfo[facilityType.toUpperCase()];
    if (!dataObj) { // try generic data obj
      if ( Array.isArray(response.parameters.facilities) && response.parameters.facilities.length > 0) {
        facilityType = response.parameters.facilities[0]; // generic
      } else if (! Array.isArray(response.parameters.facilities)) {
        facilityType = response.parameters.facilities || response.parameters.facility; // generic
      }
      if (facilityType) {
        facilityType = facilityType.replace("?", "");
        facilityType = facilityType.replace("-", " ");
        facilityType = pluralize.singular(facilityType);
        dataObj = facilityInfo[facilityType.toUpperCase()];
      }
      
    }

    return dataObj;
}


function isNotEmpty(str) {
    return !(!str || 0 === str.length);
  }
function equalsIgnoreCase(a, b) {
    if (!a || !b) {
        return false;
    } 
    if (a === b) {
        return true;
    }

    return a.toLowerCase() === b.toLowerCase();

}
module.exports = {
    hasParam: hasParam,
    formatTime: formatTime,
    isBetween : isBetween,
    facilityValue: facilityValue,
    getFacilityObjectFromResponse: getFacilityObjectFromResponse,
    isNotEmpty : isNotEmpty,
    facilityCost: facilityCost,
    getFacility:getFacility,
    equalsIgnoreCase:equalsIgnoreCase

};

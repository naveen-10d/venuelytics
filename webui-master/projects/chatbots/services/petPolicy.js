"use strict";
const Users = require("../models/users");
const serviceApi = require("../apis/app-api");
const aiUtil = require('../lib/aiutils');

const sendAnswer = function(userId, response, channel) {
    const user = Users.getUser(userId);
    const venue = user.state.get("venue");
    let data = user.state.get('facilityInfo');
    if (!data) {
        serviceApi.getFacilityInfo(venue.id, result => {
            user.state.set("facilityInfo", result);
            sendAnswerPetPolicy(user, response, channel);
        });
        
    } else {
        sendAnswerPetPolicy(user, response, channel);
    }

};
function sendAnswerPetPolicy(user, response, channel) {
    let pets = response.parameters.pets;
    let petName = response.parameters.petName;
    let propName = 'Other Pets';
    if (pets && pets.toLowerCase() === 'pet policy') {
      propName = 'Pets';
    } else if (petName && petName.toLowerCase().indexOf('dog') > -1 || petName.toLowerCase().indexOf('poodle') > -1 ){
      propName = 'Dogs';
    } else if (petName && petName.toLowerCase().indexOf('cat')> -1 ){
      propName = 'Cats';
    } 
    const facilityInfo = user.state.get("facilityInfo");
  
    const petPolicy = facilityInfo[propName.toUpperCase()];
    const generalPolicy = facilityInfo["Pets".toUpperCase()];
  
    if (petPolicy && petPolicy.text) {
      channel.sendMessage(user.id, petPolicy.text);
    } else if (petPolicy && petPolicy.present === 'N'){
      channel.sendMessage(user.id, `Sorry, We don't allow ${petName}.`);
    } else {
      if (propName !== 'Pets' && generalPolicy && generalPolicy.text) {
        channel.sendMessage(user.id, generalPolicy.text);
      } else if (propName !== 'Pets') {
        channel.sendMessage(user.id, 'Sorry we don\'t allow any pets');
      }
      
    }
    return;
}
module.exports = {
    sendAnswer: sendAnswer
};
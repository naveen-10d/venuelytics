'use strict';
var config = require('../config');
var apiai = require("apiai");


var app = apiai(config.ai_client_access_token);

const aiProcessText = function(senderId, text, success, failure) {
    var options = {
        sessionId: senderId
    };
    
    var request = app.textRequest(text, options);
    request.on('response', function(response) {
        success(senderId, simplify(response));
    });
    
    request.on('error', function(error) {
        failure(senderId, error);
    });
    
    request.end();
    
};

const aiProcessTextWithContext = function(context, text, success, failure) {
    var options = {
        sessionId: 'none-session',
        contexts: [
            {
                name: `${context}`,
            }
        ]
    };
    
    var request = app.textRequest(text, options);
    request.on('response', function(response) {
        success(simplify(response));
    });
    
    request.on('error', function(error) {
        failure(error);
    });
    
    request.end();
    
};
function simplify(response) {
    var obj ={};
    obj.sessionId = response.sessionId;
    obj.status = response.status;
    obj.source = response.result.source;
    obj.queryText = response.result.resolvedQuery;
    obj.action = response.result.action;
    obj.score = response.result.score;
    obj.responseSpeech = response.result.fulfillment.speech;
    obj.parameters = response.result.parameters;
    return obj;

}
module.exports = {
    aiProcessText : aiProcessText,
    aiProcessTextWithContext : aiProcessTextWithContext
};

'use strict';
const AWS = require('aws-sdk');

const config = {}; 
config.service = {}; 
config.service.port = process.env.PORT || 9000;
config.devMode = process.env.PROD !== "true";
config.WEBHOOK_TOKEN = "venuelytics-fb-agent-EAAcYqcwl1BwBANOAT";
config.PAGE_ACCESS_TOKEN = "EAAcYqcwl1BwBANOATkspAplSbNdTDvXmbhyE8VdnQj44yjvfJROCcEn7uVy6NYZAPmbAQyZCxgzjbFNQQ5uN94ZB28ZAIoKewqSxCEUmHBdZAjL8MOh8BZBrtgh43AmLr708IHZBV0ZC8DedkvR8PYb8D8MiEWOT7U9vBC2KDPb3VgZDZD";

const API_SERVER = process.env.SERVER || 'localhost:8280';
const LOCAL_SRVR = 'localhost:8080';


const DEV_WEBUI = "http://dev.api.venuelytics.com";
const PROD_WEBUI = "https://www.venuelytics.com";
const LOCAL_WEBUI = "http://localhost:8000/";

const DEV_SQS_QUEUE = "https://sqs.us-west-1.amazonaws.com/568029541497/dev_queue_chatbot";
const PROD_SQS_QUEUE = "https://sqs.us-west-1.amazonaws.com/568029541497/prod_queue_chatbot";

const GOOGLE_PLACES_API_KEY = "AIzaSyAqJFhOAA28JQsTmU5SITQAH6CKKWksCKc";

config.ai_client_access_token = 'f90c7a6106fa420a9d1f7cb4078cbaf0';
config.getAppUrl = () => {
    console.log("LOCAL: " +process.env.LOCAL);
    if (process.env.LOCAL === 'true') {
        return `http://${LOCAL_SRVR}/WebServices/rsapi/v1`;
    } else {
        const appAPIUrl =  `http://${API_SERVER}/WebServices/rsapi/v1`;
        console.log(`using ${appAPIUrl}`);
        return appAPIUrl;
    }
    
};

config.getWebUIUrl = () => {
    return config.devMode ? `${DEV_WEBUI}`: `${PROD_WEBUI}`;
};

config.getSQSQueueUrl = () => {
    return config.devMode ? DEV_SQS_QUEUE : PROD_SQS_QUEUE;
};
//config.accountSid = 'AC273fe799ac5d6af28239e657c3457f80';
//config.authToken = '1bf72c4bb389d44d3cbd0de4acc2e73c';

config.accountSid =  'AC227acd740f9ff82b02f09298a8c13e0d';
config.authToken = "1d9fa8df3728c108929887407cc0c552";

config.smsDebug = (process.env.DEBUG === "true" ) || false;

config.enableProxy = process.env.PROXY === "true";

config.proxy = {'proxy':'http://localhost:8888'};

console.log("sms debug: " + config.smsDebug);
config.sms_debug_agent_number = '+14156492881';//'+17027660204'
config.getPort = () => {
    return config.service.port;
};
config.session_secret = "venuelytics-secret-bcef-0000-cddc";

AWS.config.update({
  region: 'us-west-1',
  accessKeyId: 'AKIAJEXRDW6PYQQW7A7Q',
  secretAccessKey: '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'
});

config.getPlacesAPiKey = function() {
    return GOOGLE_PLACES_API_KEY;
}
module.exports = config;


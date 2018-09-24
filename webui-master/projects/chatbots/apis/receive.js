'use strict';

var controller = require('../controllers/facebook-controller');

/*
 * handleReceivePostback — Postback event handler triggered by a postback
 * action you, the developer, specify on a button in a template. Read more at:
 * developers.facebook.com/docs/messenger-platform/webhook-reference/postback
 */
const handleReceivePostback = (event) => {
  controller.handleReceivePostback(event);
};


/*
 * handleReceiveMessage - Message Event called when a message is sent to
 * your page. The 'message' object format can vary depending on the kind
 * of message that was received. Read more at: https://developers.facebook.com/
 * docs/messenger-platform/webhook-reference/message-received
 */
const handleReceiveMessage = (event) => {
  controller.handleReceiveMessage(event);
};


module.exports =  {
  handleReceivePostback : handleReceivePostback,
  handleReceiveMessage : handleReceiveMessage,
};

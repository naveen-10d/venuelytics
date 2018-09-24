'use strict';
var express = require("express");
var router = express.Router();

var config  = require('../config');
var receiveApi = require('../apis/receive');

/**
 * This is used so that Facebook can verify that they have
 * the correct Webhook location for your app.
 *
 * The Webhook token must be set in your app's configuration page
 * as well as in your servers environment.
 */
router.get('/webhook', (req, res) => {

    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.WEBHOOK_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.send(req.query['hub.challenge']);
    } else {
      res.status(403).send('Error, Wrong token');
    }
  });
  
//router.post("/webhook", controller.setwebhook);

/**
 * Once your Webhook is verified this is where you will receive
 * all interactions from the users of you Messenger Application.
 *
 * You can subscribe to many different types of messages.
 * However for this demo we've only handled what is necessary:
 * 1. Regular messages
 * 2. Postbacks
 */
router.post('/webhook', (req, res) => {
    /*
    You must send back a status of 200(success) within 20 seconds
    to let us know you've successfully received the callback.
    Otherwise, the request will time out.
    When a request times out from Facebook the service attempts
    to resend the message.
    This is why it is good to send a response immediately so you
    don't get duplicate messages in the event that a request takes
    awhile to process.
  */
  res.sendStatus(200);

  const data = req.body;
  console.log('Webhook POST', JSON.stringify(data));

  // Make sure this is a page subscription
  if (data.object === 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach((pageEntry) => {
      if (!pageEntry.messaging) {
        return;
      }
      // Iterate over each messaging event and handle accordingly
      pageEntry.messaging.forEach((messagingEvent) => {
        console.log({messagingEvent});

        if (messagingEvent.message) {
          receiveApi.handleReceiveMessage(messagingEvent);
        }

        if (messagingEvent.postback) {
          receiveApi.handleReceivePostback(messagingEvent);
        } else {
          console.log(
            'Webhook received unknown messagingEvent: ',
            messagingEvent
          );
        }
      });
    });
  }
});

module.exports = router;
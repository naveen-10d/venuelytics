'use strict';
const express = require("express");
const router = express.Router();

const facebookHandler = require('./facebook');
const smsHandler = require('./sms');
const googleAssistantHandler = require('./googleAssistant');

router.use('/facebook', facebookHandler);
router.use('/smsbot', smsHandler);
router.use('/googleAssistant', googleAssistantHandler);

module.exports = router;
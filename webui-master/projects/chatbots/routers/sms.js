'use strict';

var express = require("express");
var router = express.Router();
var controller = require("../controllers/smschatbot");

router.get("/webhook", controller.getwebhook);
router.post("/webhook", controller.setwebhook);

module.exports = router;




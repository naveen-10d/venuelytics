'use strict';
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const clientPath = path.resolve(__dirname, "client");

const bodyParser = require('body-parser');

const ejs = require("ejs");
const config = require('./config');
const favicon = require('serve-favicon');
const logger = require('morgan');

const chatbotHandlers = require("./routers");
const appApi = require('./apis/app-api');
const botAgents = require('./models/botagents');

var webbot = require("./controllers/webchat");

/*============Initialize and COnfiguration===============*/

const session = require('express-session')({
  secret: config.session_secret,
  resave: true,
  saveUninitialized: true
});

const sharedsession = require("express-socket.io-session");

const cookieParser = require("cookie-parser");


/* ---------------------------------- */

const app = express();
const demo = config.demo_mode;
app.use(logger('dev'));
app.use(session);
app.use(bodyParser.json({ limit: '50mb' }));
app.set('view engine', 'ejs');
appApi.getBotAgents((result) => {
  if (!!result) {
    result.forEach(element => {
      botAgents.addBotAgent(element.value, element.venueNumber);
      if (element.value.startsWith('+')) {
        botAgents.addBotAgent(element.value.substring(1), element.venueNumber);
      } else {
        botAgents.addBotAgent('+'+element.value, element.venueNumber);
      }
    });
  }
});

/* ----------  Static Assets  ---------- */
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico'))); // eslint-disable-line

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Accept, Content-Type, Content-Length, Authorization, X-Requested-With, X-XSRF-TOKEN, withCredentials"
    );
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        console.log("OPTIONS SUCCESS");
        res.end();
        return;
    }
    next();
});

app.use('/chatbots', chatbotHandlers);
app.all("/", function (req, res) {
    res.status(200).sendFile(path.join(__dirname, "/views/index.html"));
});

/* ----------  Errors  ---------- */

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  /**
   * development error handler
   * will print stacktrace
   */
  if (app.get('env') === 'development') {
    app.use((err, req, res) => {
      res.status(err.status || 500);
      new Error(err); // eslint-disable-line no-new
    });
  }
  
  /**
   * production error handler
   * no stacktraces leaked to user
   */
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {},
    });
  });

const server = app.listen(config.getPort());
var io = require('socket.io').listen(server);
io.use(sharedsession(session, {
  autoSave:true
})); 
console.log('Express server listening on port: ' + config.getPort());

var allClients = [];
io.on('connection', (socket)=>{
  console.log('a user connected');
  
  allClients.push(socket);
  socket.on('message', (message)=>{
    webbot.handleReceiveMessage(message, socket);
  });

  socket.on('init', (message)=>{
    webbot.handleInitMessage(message, socket);
  });

  socket.on('disconnect', ()=>{
    console.log('disconnected ..');
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  });
});




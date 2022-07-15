const express = require('express');

const { guestBookHandler, addComment } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler, getSignupForm } = require('./app/signupHandler.js');
const { getTimeStamp, injectCookies, injectSession, logHandler, errorHandler } = require('./app/utils.js');

const createApp = (config, sessions = {}, userData = {}) => {
  const app = express();
  const handleSessions = injectSession(sessions);

  app.use(logHandler(config.logger));
  app.use(getTimeStamp);
  app.use(injectCookies);
  app.use(handleSessions);
  app.use(express.urlencoded({ extended: true }));

  app.get('/signup-page', getSignupForm);
  app.post('/signup', signupHandler(userData));

  app.get('/login', loginPageHandler(config.loginPage));
  app.post('/login', loginHandler(sessions, userData));

  app.get('/guestbook', guestBookHandler(config));
  app.post('/guestbook', addComment(config));
  app.get('/logout', logoutHandler(sessions));

  app.use(express.static(config.publicDir));
  app.use(errorHandler)

  return app;
};

module.exports = { createApp };
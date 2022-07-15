const express = require('express');

const { guestBookHandler, addComment } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler, getSignupForm } = require('./app/signupHandler.js');
const { getTimeStamp, injectCookies, injectSession, logHandler, errorHandler } = require('./app/utils.js');

const createLoginRouter = (config, sessions, userData) => {
  const router = express.Router();
  router.get('/', loginPageHandler(config.loginPage));
  router.post('/', loginHandler(sessions, userData));
  return router;
};

const createGuestBookRouter = config => {
  const router = express.Router();
  router.get('/', guestBookHandler(config));
  router.post('/', addComment(config));
  return router;
};

const createSignupRouter = userData => {
  const router = express.Router();
  router.get('/', getSignupForm);
  router.post('/', signupHandler(userData));
  return router;
};

const createApp = (config, sessions = {}, userData = {}) => {
  const app = express();
  const logger = logHandler(config.logger);
  const handleSessions = injectSession(sessions);
  const handleLogout = logoutHandler(sessions);
  const handleStatic = express.static(config.publicDir);

  const loginRouter = createLoginRouter(config, sessions, userData);
  const guestbookRouter = createGuestBookRouter(config);
  const signupRouter = createSignupRouter(userData);

  app.use(express.urlencoded({ extended: true }));
  app.use(logger);
  app.use(getTimeStamp);
  app.use(injectCookies);
  app.use(handleSessions);

  app.use('/signup', signupRouter);
  app.use('/login', loginRouter);
  app.use('/guestbook', guestbookRouter);
  app.get('/logout', handleLogout);

  app.use(handleStatic);
  app.use(errorHandler)

  return app;
};

module.exports = { createApp };
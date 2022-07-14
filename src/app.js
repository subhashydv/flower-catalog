const { guestBookHandler, addComment } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler, getSignupForm } = require('./app/signupHandler.js');
const { staticHandler } = require('./app/staticHandler.js');
const { parseUrl, getTimeStamp, injectCookies, parseBodyParams,
  injectSession, logHandler, errorHandler } = require('./app/utils.js');
const { Router } = require('./server/router.js');


const app = (config, sessions = {}, userData = {}) => {
  const handleSessions = injectSession(sessions);
  const handleLog = logHandler(config.logger);

  const router = new Router();
  router.addMiddleWare(parseUrl);
  router.addMiddleWare(handleLog);
  router.addMiddleWare(getTimeStamp);
  router.addMiddleWare(injectCookies);
  router.addMiddleWare(parseBodyParams);
  router.addMiddleWare(handleSessions);

  router.get('/signup-page', getSignupForm);
  router.post('/signup', signupHandler(userData));

  router.get('/login', loginPageHandler(config.loginPage));
  router.post('/login', loginHandler(sessions, userData));
  router.get('/guestbook', guestBookHandler(config));
  router.post('/guestbook', addComment(config));

  router.get('/logout', logoutHandler(sessions));

  router.default(staticHandler(config.publicDir));
  router.default(errorHandler)

  return router;
};

module.exports = { app };
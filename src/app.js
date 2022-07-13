const { router } = require('./server/router.js');

const { guestBookHandler } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler } = require('./app/signupHandler.js');
const { staticHandler } = require('./app/staticHandler.js');
const { parseUrl, getTimeStamp, injectCookies, parseBodyParams,
  injectSession, logHandler, errorHandler } = require('./app/utils.js');

const app = config => {
  return router([parseUrl,
    getTimeStamp,
    logHandler,
    injectCookies,
    parseBodyParams,
    injectSession(config.sessions),
    signupHandler(config.userCred),
    loginPageHandler(config.loginPage),
    loginHandler(config.sessions, config.userCred),
    guestBookHandler(config.comments),
    staticHandler(config.publicDir),
    logoutHandler(config.sessions),
    errorHandler]);
};

module.exports = { app };
const { router } = require('./server/router.js');

const { guestBookHandler } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler } = require('./app/signupHandler.js');
const { staticHandler } = require('./app/staticHandler.js');
const { parseUrl, getTimeStamp, injectCookies, parseBodyParams,
  injectSession, logHandler, errorHandler } = require('./app/utils.js');

const app = (config, sessions = {}, userData = {}) => {
  return router([parseUrl,
    getTimeStamp,
    logHandler(config.logger),
    injectCookies,
    parseBodyParams,
    injectSession(sessions),
    signupHandler(userData),
    loginPageHandler(config.loginPage),
    loginHandler(sessions, userData),
    guestBookHandler(config),
    staticHandler(config.publicDir),
    logoutHandler(sessions),
    errorHandler]);
};

module.exports = { app };
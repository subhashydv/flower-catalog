const fs = require('fs');

const { router } = require('./server/router.js');
const { GuestBook } = require('./app/guestBook.js');
const { guestBookHandler } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler } = require('./app/signupHandler.js');
const { staticHandler } = require('./app/staticHandler.js');
const { parseUrl, getTimeStamp, injectCookies, parseBodyParams, injectSession, logHandler, errorHandler } = require('./app/utils.js');

const readFile = fileName => JSON.parse(fs.readFileSync(fileName), 'utf8');
const guestBook = new GuestBook(readFile('data/comment.json'));
const loginPage = fs.readFileSync('public/login.html');

const sessions = {};
const userCred = { swap: { user: 'swapnil' } };

const handlers = [parseUrl, getTimeStamp, logHandler, injectCookies, parseBodyParams, injectSession(sessions), signupHandler(userCred), loginPageHandler(loginPage), loginHandler(sessions, userCred), guestBookHandler(guestBook), staticHandler('public'), logoutHandler(sessions), errorHandler];


const app = router(handlers);

module.exports = { app };
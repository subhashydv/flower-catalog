const fs = require('fs');
const { GuestBook } = require('./app/guestBook.js');
const { guestBookHandler } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');

const { signupHandler } = require('./app/signupHandler.js');
const { staticHandler } = require('./app/staticHandler.js');
const { getTimeStamp, injectCookies, parseBodyParams, injectSession, logHandler, errorHandler } = require('./app/utils.js');

const readFile = fileName => JSON.parse(fs.readFileSync(fileName), 'utf8');
const guestBook = new GuestBook(readFile('data/comment.json'));
const loginPage = fs.readFileSync('public/login.html');

const sessions = {};
const userCred = { swap: { user: 'swapnil' } };

const handlers = [getTimeStamp, logHandler, injectCookies, parseBodyParams, injectSession(sessions), signupHandler(userCred), loginPageHandler(loginPage), loginHandler(sessions, userCred), guestBookHandler(guestBook), staticHandler('public'), logoutHandler(sessions), errorHandler];

module.exports = { handlers };
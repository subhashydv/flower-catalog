const fs = require('fs');
const { GuestBook } = require('./app/guestBook.js');
const { guestBookHandler } = require('./app/guestBookHandler.js');
const { loginHandler, loginPageHandler } = require('./app/loginHandler.js');
const { logoutHandler } = require('./app/logoutHandler.js');
const { staticHandler } = require('./app/staticHandler.js');
const { getTimeStamp, injectCookies, parseBodyParams, injectSession, logHandler, errorHandler } = require('./app/utils.js');

const readFile = fileName => JSON.parse(fs.readFileSync(fileName), 'utf8');
const guestBook = new GuestBook(readFile('data/comment.json'));

const sessions = {};

const handlers = [getTimeStamp, logHandler, injectCookies, parseBodyParams, injectSession(sessions), loginPageHandler, loginHandler(sessions), guestBookHandler(guestBook), staticHandler('public'), logoutHandler(sessions), errorHandler];

module.exports = { handlers };
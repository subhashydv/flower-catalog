const fs = require('fs');
const { GuestBook } = require('./app/guestBook.js');
const { guestBookHandler } = require('./app/guestBookHandler.js');
const { parseBodyParams } = require('./app/parseBodyParams.js');
const { staticHandler } = require('./app/staticHandler.js');
const { getTimeStamp, logHandler, errorHandler } = require('./app/utils.js');

const readFile = fileName => JSON.parse(fs.readFileSync(fileName), 'utf8');
const guestBook = new GuestBook(readFile('data/comment.json'));

const handlers = [logHandler, getTimeStamp, parseBodyParams, guestBookHandler(guestBook), staticHandler('public'), errorHandler];

module.exports = { handlers };
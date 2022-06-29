const fs = require('fs');
const { guestBookHandler } = require('./app/guestBookHandler.js');
const { serveFileContent, errorHandler, logHandler } = require('./app/staticHandler.js');

const readFile = fileName => JSON.parse(fs.readFileSync(fileName), 'utf8');
const guestBook = readFile('data/comment.json');

const handlers = [logHandler, guestBookHandler(guestBook), serveFileContent('public'), errorHandler];

const handle = (handlers, serveFrom) => (request, response) => {
  for (const handler of handlers) {
    if (handler(request, response, serveFrom)) {
      return true;
    }
  }
  return false;
};

module.exports = { handlers, handle };
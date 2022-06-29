const { guestBookHandler } = require('./app/guestBookHandler.js');
const { serveFileContent, errorHandler, logHandler } = require('./app/staticHandler.js');

const handlers = [logHandler, guestBookHandler('data/comment.json'), serveFileContent('public'), errorHandler];

const handle = (handlers, serveFrom) => (request, response) => {
  for (const handler of handlers) {
    if (handler(request, response, serveFrom)) {
      return true;
    }
  }
  return false;
};

module.exports = { handlers, handle };
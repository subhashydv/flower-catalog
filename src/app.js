const { dynamicHandler } = require('./app/guestBookHandler.js');
const { serveFileContent, errorHandler } = require('./app/staticHandler.js');

const handlers = [dynamicHandler, serveFileContent, errorHandler];

const handle = (handlers, serveFrom) => (request, response) => {
  for (const handler of handlers) {
    if (handler(request, response, serveFrom)) {
      return true;
    }
  }
  return false;
};

module.exports = { handlers, handle };
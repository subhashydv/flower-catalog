const http = require('http');
const { requestHandler } = require('../app/requestHandler.js');
const { URL } = require('url');

const createUrl = req => `http://${req.headers.host}${req.url}`;

const handle = (request, response, handlers, serveFrom) => {
  for (const handler of handlers) {
    if (handler(request, response, serveFrom)) {
      return true;
    }
  }
  return false;
};


const startServer = (port, handlers, serveFrom) => {
  const server = http.createServer((req, res) => {
    req.url = new URL(createUrl(req));
    handle(req, res, handlers, serveFrom);
  })
  server.listen(port, () => console.log(`listening on ${port} `));
};



module.exports = { startServer };
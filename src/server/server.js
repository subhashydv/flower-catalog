const http = require('http');
const { URL } = require('url');

const createUrl = req => `http://${req.headers.host}${req.url}`;

const startServer = (port, handle) => {
  const server = http.createServer((req, res) => {
    req.url = new URL(createUrl(req));
    handle(req, res);
  })
  server.listen(port, () => console.log(`listening on ${port} `));
};

module.exports = { startServer };
const http = require('http');
const { URL } = require('url');

const createUrl = req => `http://${req.headers.host}${req.url}`;

const logRequest = ({ pathname }) => {
  console.log(pathname);
};

const startServer = (port, handler) => {
  const server = http.createServer((req, res) => {
    req.url = new URL(createUrl(req));
    logRequest(req.url);
    handler(req, res);
  })
  server.listen(port, () => console.log(`listening on ${port} `));
};

module.exports = { startServer };
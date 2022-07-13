const http = require('http');

const startServer = (port, handle) => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  })
  server.listen(port, () => console.log(`listening on ${port} `));
};

module.exports = { startServer };
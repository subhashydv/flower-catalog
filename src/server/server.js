const http = require('http');


const startServer = (port, router) => {
  const server = http.createServer((req, res) => {
    router.handle(req, res);
  })
  server.listen(port, () => console.log(`listening on ${port} `));
};

module.exports = { startServer };
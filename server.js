const { createServer } = require('net');
const { parseRequest } = require('./src/parser.js');
const { requestHandler } = require('./src/requestHandler.js',);
const { Response } = require('./src/response.js');

const handle = (handlers, request, response, serveFrom) => {
  for (const handler of handlers) {
    if (handler(request, response, serveFrom)) {
      return true;
    }
  }
  return false;
};

const onConnection = (socket, handlers, serveFrom) => {
  const response = new Response(socket);
  socket.on('error', (error) => console.error(error.message));

  socket.on('data', (chunk) => {
    const request = parseRequest(chunk.toString());
    console.log(request.uri);
    handle(handlers, request, response, serveFrom);
  });
};

const startServer = (port, handlers, serveFrom) => {
  const server = createServer(socket =>
    onConnection(socket, handlers, serveFrom));
  server.listen(port, () => console.log(`listening on ${port}`));
};


const handlers = [requestHandler];
startServer(8800, handlers, serveFrom = './public');
const { handlers } = require('./src/app/handler.js');
const { startServer } = require('./src/server/server.js');

startServer(8800, handlers, serveFrom = './public');
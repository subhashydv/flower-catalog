const { handlers, router } = require('./src/app.js');
const { startServer } = require('./src/server/server.js');

startServer(8800, router(handlers));
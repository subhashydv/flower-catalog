const { handlers } = require('./src/app.js');
const { router } = require('./src/server/router.js');
const { startServer } = require('./src/server/server.js');

startServer(8800, router(handlers));
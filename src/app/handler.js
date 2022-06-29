const { dynamicHandler } = require('./guestBookHandler.js');
const { requestHandler } = require('./requestHandler.js');

const handlers = [dynamicHandler, requestHandler];

module.exports = { handlers };
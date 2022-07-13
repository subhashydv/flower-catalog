const fs = require('fs');
const { app } = require('./src/app.js');
const { startServer } = require('./src/server/server.js');

const readFile = fileName => fs.readFileSync(fileName);
const parseFile = fileName => JSON.parse(readFile(fileName), 'utf8');

const sessions = {};
const userCred = { swap: { user: 'swapnil' } };
const config = {
  loginPage: readFile('public/login.html'),
  publicDir: 'public',
  comments: parseFile('data/comment.json'),
  logger: console.log
};

startServer(8800, app(config, sessions, userCred));
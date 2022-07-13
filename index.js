const fs = require('fs');
const { app } = require('./src/app.js');
const { startServer } = require('./src/server/server.js');

const readFile = fileName => fs.readFileSync(fileName);
const parseFile = fileName => JSON.parse(readFile(fileName), 'utf8');

const config = {
  sessions: {},
  userCred: { swap: { user: 'swapnil' } },
  loginPage: readFile('public/login.html'),
  publicDir: 'public',
  comments: parseFile('data/comment.json'),
};

startServer(8800, app(config));
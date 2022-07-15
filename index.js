const fs = require('fs');
const { createApp } = require('./src/app.js');

const readFile = fileName => fs.readFileSync(fileName);
const parseFile = fileName => JSON.parse(readFile(fileName), 'utf8');

const sessions = {};
const userCred = { swap: { user: 'swapnil' } };

const config = {
  loginPage: readFile('public/login.html'),
  publicDir: 'public',
  comments: parseFile('data/comment.json'),
  logger: console.log,
  persist: data => fs.writeFileSync('data/comment.json', data)
};

const app = createApp(config, sessions, userCred);

app.listen(8800, () => {
  console.log('listening on 8800');
});
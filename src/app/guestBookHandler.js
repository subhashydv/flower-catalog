const fs = require('fs');
const { GuestBook } = require('./guestBook.js');

const writeInJson = (comments, fileName = 'data/comment.json') => {
  fs.writeFileSync(fileName, comments, 'utf8');
};

const readFile = fileName => fs.readFileSync(fileName, 'utf8');

const getHtml = guestBook => {
  const content = readFile('./resources/templateGuestbook.html');
  const table = guestBook.toHtml();
  return content.replace('__BODY__', table);
};

const registerComment = (req, res) => {
  const { guestBook, bodyParams, timeStamp } = req;
  guestBook.addComment({ ...bodyParams, timeStamp });
  writeInJson(guestBook.toJson());
  res.end(guestBook.toJson());
  return;
};

const showGuestBook = (req, res) => {
  const html = getHtml(req.guestBook);
  res.end(html);
  return;
};

const guestBookHandler = comments => (req, res, next) => {
  const guestBook = new GuestBook(comments);
  const { pathname } = req.url;

  if (pathname === '/guestbook' && req.method === 'POST') {
    req.guestBook = guestBook;
    return registerComment(req, res);
  }

  if (pathname === '/guestbook' && req.method === 'GET') {
    if (!req.session) {
      res.statusCode = 302;
      res.setHeader('location', '/login');
      res.end();
      return;
    }
    req.guestBook = guestBook;
    return showGuestBook(req, res);
  }
  next();
};

module.exports = { guestBookHandler };

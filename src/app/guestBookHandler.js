const fs = require('fs');
const { GuestBook } = require('./guestBook.js');

const readFile = fileName => fs.readFileSync(fileName, 'utf8');

const getHtml = guestBook => {
  const content = readFile('./resources/templateGuestbook.html');
  const table = guestBook.toHtml();
  return content.replace('__BODY__', table);
};

const registerComment = (req, res) => {
  const { guestBook, bodyParams, timeStamp } = req;
  guestBook.addComment({ ...bodyParams, timeStamp });
  req.persist(guestBook.toJson());
  res.setHeader('content-type', 'Application/json')
  res.end(guestBook.toJson());
  return;
};

const showGuestBook = (req, res) => {
  const html = getHtml(req.guestBook);
  res.setHeader('content-type', 'text/html');
  res.end(html);
  return;
};

const guestBookHandler = config => (req, res, next) => {
  const guestBook = new GuestBook(config.comments);
  const { pathname } = req.url;

  if (pathname === '/guestbook' && req.method === 'POST') {
    req.guestBook = guestBook;
    req.persist = config.persist;
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

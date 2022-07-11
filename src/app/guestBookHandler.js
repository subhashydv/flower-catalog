const fs = require('fs');

const writeInJson = (comments, fileName = 'data/comment.json') => {
  fs.writeFileSync(fileName, comments, 'utf8');
};

const readFile = fileName => fs.readFileSync(fileName, 'utf8');

const getHtml = guestBook => {
  const content = readFile('./resources/templateGuestbook.html');
  const table = guestBook.toHtml();
  return content.replace('__BODY__', table);
};

const redirectToGuestbook = (req, res) => {
  res.statusCode = 302;
  res.setHeader('location', '/guestbook')
  res.end('');
  return;
};

const registerComment = (req, res, next) => {
  const { guestBook, bodyParams, timeStamp } = req;
  console.log(bodyParams);
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

const guestBookHandler = guestBook => (req, res, next) => {
  const { pathname } = req.url;
  if (pathname === '/guestbook' && req.method === 'POST') {
    req.guestBook = guestBook;
    return registerComment(req, res, next);
  }

  if (pathname === '/guestbook' && req.method === 'GET') {
    if (!req.session) {
      res.statusCode = 302;
      res.setHeader('location', '/login');
      res.end();
      return;
    }
    req.guestBook = guestBook;
    return showGuestBook(req, res, next);
  }
  next();
};

module.exports = { guestBookHandler };

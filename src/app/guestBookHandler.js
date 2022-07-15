const fs = require('fs');
const { GuestBook } = require('./guestBook.js');

const readFile = fileName => fs.readFileSync(fileName, 'utf8');

const getHtml = guestBook => {
  const content = readFile('./resources/templateGuestbook.html');
  const table = guestBook.toHtml();
  return content.replace('__BODY__', table);
};

const registerComment = (req, res) => {
  const { guestBook, body, timeStamp } = req;
  guestBook.addComment({ ...body, timeStamp });
  req.persist(guestBook.toJson());
  res.set('content-type', 'Application/json').end(guestBook.toJson());
  return;
};

const showGuestBook = (req, res) => {
  const html = getHtml(req.guestBook);
  res.set('content-type', 'text/html').end(html);
  return;
};

const addComment = ({ comments, persist }) => (req, res, next) => {
  const guestBook = new GuestBook(comments);
  req.guestBook = guestBook;
  req.persist = persist;
  return registerComment(req, res);
};


const guestBookHandler = ({ comments }) => (req, res, next) => {
  if (!req.session) {
    res.statusCode = 302;
    res.redirect('/login');
    return;
  }
  const guestBook = new GuestBook(comments);
  req.guestBook = guestBook;
  return showGuestBook(req, res);
}

module.exports = { guestBookHandler, addComment };

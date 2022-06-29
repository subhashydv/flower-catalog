const fs = require('fs');

const writeInJson = (comments, fileName = 'data/comment.json') => {
  fs.writeFileSync(fileName, comments, 'utf8');
};

const readFile = fileName => fs.readFileSync(fileName, 'utf8');

const getTimeStamp = () => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  return `${date} ${hour}:${minute}`;
};

const getHtml = guestBook => {
  const content = readFile('./resources/templateGuestbook.html');
  const table = guestBook.toHtml();
  return content.replace('__BODY__', table);
};

const redirectToGuestbook = (request, response) => {
  response.statusCode = 302;
  response.setHeader('location', '/guestbook')
  response.end('');
  return true;
};

const toGuestBookParams = req => {
  const queryParams = {};
  const entries = req.url.searchParams.entries();
  for (const entry of entries) {
    queryParams[entry[0]] = entry[1];
  }
  queryParams.timeStamp = getTimeStamp();

  return queryParams;
}

const registerComment = (request, response) => {
  const { guestBook } = request;
  guestBook.addComment(toGuestBookParams(request));
  writeInJson(guestBook.toJson());
  return redirectToGuestbook(request, response);
};

const showGuestBook = (request, response) => {
  const html = getHtml(request.guestBook);
  response.end(html);
  return true;
};

const guestBookHandler = guestBook => (request, response) => {
  const { pathname } = request.url;
  if (pathname === '/addcomment') {
    return registerComment({ ...request, guestBook }, response);
  }

  if (pathname === '/guestbook') {
    return showGuestBook({ ...request, guestBook }, response);
  }
  return false;
};

module.exports = { guestBookHandler };

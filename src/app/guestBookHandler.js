const fs = require('fs');

const writeInJson = (comments, fileName = 'data/comment.json') => {
  fs.writeFileSync(fileName, JSON.stringify(comments), 'utf8');
};

const getTimeStamp = () => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  return `${date} ${hour}:${minute}`;
};

const generateHtml = comments => {
  return comments.map(comment => {
    return `<tr><td>${comment.timeStamp}</td><td>${comment.name}</td><td>${comment.comment}</td></tr>`;
  }).join('');
};

const getHtml = comments => {
  const content = fs.readFileSync('./resources/templateGuestbook.html', 'utf8');
  const table = generateHtml(comments);
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
  guestBook.push(toGuestBookParams(request));
  writeInJson(guestBook);
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

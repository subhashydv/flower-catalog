const fs = require('fs');

const writeInJson = (comments, fileName) => {
  fs.writeFileSync(fileName, JSON.stringify(comments), 'utf8');
};

const readFile = fileName => {
  return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
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
  response.send('');
  return true;
};

const registerComment = (request, response) => {
  const reviews = readFile(request.commentFile);
  const { name, comment } = request;
  const timeStamp = getTimeStamp();
  reviews.push({ name, comment, timeStamp });
  writeInJson(reviews, request.commentFile);
  return redirectToGuestbook(request, response);
};

const guestBookHandler = (request, response) => {
  const reviews = readFile(request.commentFile);
  const html = getHtml(reviews);
  response.send(html);
  return true;
};

module.exports = { guestBookHandler, registerComment };

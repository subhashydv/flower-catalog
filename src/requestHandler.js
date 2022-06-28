const fs = require('fs');
const { showReviews, registerComment } = require('./guestBookHandler.js');

const contentType = {
  txt: 'text/plain',
  html: 'text/html',
  png: 'image/png',
  jpg: 'image/jpeg'
};

const extension = fileName => {
  const indexOfDot = fileName.indexOf('.');
  return fileName.slice(indexOfDot + 1);
};

const serveFileContent = ({ uri }, response) => {
  const fileName = uri === '/' ? 'public/flower-catalog.html' : `public/${uri}`;

  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', contentType[extension(fileName)]);
    response.send(content);
    return true;
  }

  return false;
};

const requestHandler = (request, response, serveFrom) => {
  const { uri } = request;
  const commentFile = 'reviews.json';

  if (uri.includes('.') || uri === '/') {
    return serveFileContent(request, response, serveFrom);
  }
  if (uri === '/addcomment') {
    return registerComment(request, response, commentFile);
  }

  if (uri === '/guestbook') {
    return showReviews(request, response, commentFile);
  }
  return false
}

module.exports = { requestHandler };

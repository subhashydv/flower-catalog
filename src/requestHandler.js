const fs = require('fs');
const { showReviews, guestBookHandler } = require('./guestBookHandler.js');

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
  console.log(uri);
  const fileName = uri === '/' ? 'public/flower-catalog.html' : `public/${uri}`;
  console.log(fileName);

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
  if (uri.includes('.') || uri === '/') {
    return serveFileContent(request, response, serveFrom);
  }
  if (uri === '/addcomment') {
    return guestBookHandler(request, response);
  }

  if (uri === '/guestbook') {
    return showReviews(request, response);
  }
  return false
}

module.exports = { requestHandler };

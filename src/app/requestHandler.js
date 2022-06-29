const fs = require('fs');
const { guestBookHandler, registerComment } = require('./guestBookHandler.js');

const contentType = {
  txt: 'text/plain',
  html: 'text/html',
  png: 'image/png',
  jpg: 'image/jpeg',
  css: 'text/css',
  gif: 'image/gif'
};

const extension = fileName => {
  const indexOfDot = fileName.indexOf('.');
  return fileName.slice(indexOfDot + 1);
};

const serveFileContent = (req, response) => {
  const { pathname } = req.url;
  const fileName = pathname === '/' ? 'public/flower-catalog.html' : `public/${pathname}`;

  if (fs.existsSync(fileName)) {
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', contentType[extension(fileName)]);
    response.end(content);
    return true;
  }

  return false;
};

const requestHandler = (request, response, serveFrom) => {
  const { pathname } = request.url;

  if (pathname.includes('.') || pathname === '/') {
    console.log(pathname);
    return serveFileContent(request, response, serveFrom);
  }
  return false
}

module.exports = { requestHandler };

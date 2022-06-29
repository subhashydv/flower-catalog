const fs = require('fs');

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

const mimeType = fileName => contentType[extension(fileName)];

const serveFileContent = serveFrom => (request, response) => {
  const { pathname } = request.url;
  const fileName = pathname === '/' ? `${serveFrom}/flower-catalog.html` : `${serveFrom}/${pathname}`;

  try {
    const content = fs.readFileSync(fileName);
    response.setHeader('content-type', mimeType(fileName));
    response.end(content);
  } catch (err) {
    return false
  }
  return true;
};

const errorHandler = (request, response) => {
  response.statusCode = 404;
  response.end('Error 404');
  return true;
};

const logHandler = (request, response) => {
  console.log(request.method, ' : ', request.url.pathname);
  return false
};

module.exports = { serveFileContent, errorHandler, logHandler };

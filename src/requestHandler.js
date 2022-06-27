const fs = require('fs');

const extension = fileName => {
  const indexOfDot = fileName.indexOf('.');
  return fileName.slice(indexOfDot + 1);
};

const contentType = {
  txt: 'text/plain',
  html: 'text/html',
  png: 'image/png',
  jpg: 'image/jpeg'
};

const serveFileContent = ({ uri }, response, serveFrom) => {
  const fileName = uri === '/' ? 'public/flowerCatalog.html' : `public/${uri}`;

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
  return false
}

module.exports = { requestHandler };

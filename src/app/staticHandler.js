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

const serveFileContent = (req, res, next) => {
  const { pathname } = req.url;
  const { serveFrom } = req;

  const fileName = pathname === '/' ? `${serveFrom}/flower-catalog.html` : `${serveFrom}/${pathname}`;

  try {
    const content = fs.readFileSync(fileName);
    res.setHeader('content-type', mimeType(fileName));
    res.end(content);
  } catch (err) {
    next();
  }
  return;
};

const staticHandler = serveFrom => (req, res, next) => {
  if (req.method === 'GET') {
    req.serveFrom = serveFrom;
    return serveFileContent(req, res, next);
  }
  next();
}

module.exports = { staticHandler };

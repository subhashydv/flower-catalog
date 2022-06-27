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

const getTimeStamp = () => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  return `${date} ${hour}:${minute}`;
};

const spaceParse = text => {
  return text.replace('+', ' ');
}

const generateHtml = reviews => {
  return reviews.map(review => {
    const name = spaceParse(review.name);
    const comment = spaceParse(review.comment);
    return `<td>${review.timeStamp}</td><td>${name}</td><td>${comment}</td>`;
  }).join('');
}

const getHtml = (reviews) => {
  const content = fs.readFileSync('./public/guestbook.html', 'utf-8');
  const table = generateHtml(reviews);
  return content.replace('__BODY__', table);
}

const guestBookHandler = (request, response) => {
  const reviews = [];
  const { name, comment } = request;
  const timeStamp = getTimeStamp();
  reviews.push({ name, comment, timeStamp });
  const html = getHtml(reviews);
  response.send(html);
  return true;
};

const requestHandler = (request, response, serveFrom) => {
  const { uri } = request;
  if (uri.includes('.') || uri === '/') {
    return serveFileContent(request, response, serveFrom);
  }
  if (uri === '/guestbook') {
    return guestBookHandler(request, response);
  }
  return false
}

module.exports = { requestHandler };

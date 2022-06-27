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
  return text;
}

const generateHtml = reviews => {
  return reviews.map(review => {
    const name = spaceParse(review.name);
    const comment = spaceParse(review.comment);
    return `<tr><td>${review.timeStamp}</td><td>${name}</td><td>${comment}</td></tr>`;
  }).join('');
};

const getHtml = (reviews) => {
  const content = fs.readFileSync('./public/guestbook.html', 'utf-8');
  const table = generateHtml(reviews);
  return content.replace('__BODY__', table);
};

const storeReviews = reviews => {
  fs.writeFileSync('reviews.json', JSON.stringify(reviews), 'utf8');
};

const readPrevReviews = () => {
  return JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));
}

const guestBookHandler = (request, response, reviews) => {
  const { name, comment } = request;
  const timeStamp = getTimeStamp();
  reviews.push({ name, comment, timeStamp });
  storeReviews(reviews);
  response.statusCode = 301;
  response.setHeader('location', '/guestbook')
  response.send('');
  return true;
};

const showReviews = (request, response, reviews) => {
  const html = getHtml(reviews);
  response.send(html);
  return true;
};

const requestHandler = (request, response, serveFrom) => {
  const { uri } = request;
  if (uri.includes('.') || uri === '/') {
    return serveFileContent(request, response, serveFrom);
  }
  if (uri === '/addcomment') {
    const reviews = readPrevReviews();
    return guestBookHandler(request, response, reviews);
  }

  if (uri === '/guestbook') {
    const reviews = readPrevReviews();
    return showReviews(request, response, reviews);
  }
  return false
}

module.exports = { requestHandler };

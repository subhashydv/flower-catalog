const fs = require('fs');

const getTimeStamp = () => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  return `${date} ${hour}:${minute}`;
};

const generateHtml = reviews => {
  return reviews.map(review => {
    const name = review.name;
    const comment = review.comment;
    return `<tr><td>${review.timeStamp}</td><td>${name}</td><td>${comment}</td></tr>`;
  }).join('');
};

const getHtml = (reviews) => {
  const content = fs.readFileSync('./public/guestbook.html', 'utf-8');
  const table = generateHtml(reviews);
  return content.replace('__BODY__', table);
};

const writeInJson = (reviews, fileName) => {
  fs.writeFileSync(fileName, JSON.stringify(reviews), 'utf8');
};

const readFile = fileName => {
  return JSON.parse(fs.readFileSync(fileName, 'utf-8'));
};

const registerComment = (request, response, fileName) => {
  const reviews = readFile(fileName);
  const { name, comment } = request;
  const timeStamp = getTimeStamp();
  reviews.push({ name, comment, timeStamp });
  writeInJson(reviews, fileName);
  response.statusCode = 302;
  response.setHeader('location', '/guestbook')
  response.send('');
  return true;
};

const showReviews = (request, response, fileName) => {
  const reviews = readFile(fileName);
  const html = getHtml(reviews);
  response.send(html);
  return true;
};

module.exports = { showReviews, registerComment };

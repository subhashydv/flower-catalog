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
  const table = generateHtml(reviews) || `<tr></tr>`;
  return content.replace('__BODY__', table);
};

const storeReviews = reviews => {
  fs.writeFileSync('reviews.json', JSON.stringify(reviews), 'utf8');
};

const readPrevReviews = () => {
  return JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));
}

const guestBookHandler = (request, response) => {
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

module.exports = { showReviews, guestBookHandler };

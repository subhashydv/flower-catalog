const getTimeStamp = (req, res, next) => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  req.timeStamp = `${date} ${hour}:${minute}`;
  next(req, res);
};

const logHandler = (req, res, next) => {
  console.log(req.method, ' : ', req.url.pathname);
  next(req, res);
};

const errorHandler = (req, res) => {
  res.statusCode = 404;
  res.end('Error 404');
  return true;
};

module.exports = { getTimeStamp, logHandler, errorHandler };

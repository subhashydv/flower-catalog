const identity = x => x;

const getTimeStamp = (req, res, next) => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  req.timeStamp = `${date} ${hour}:${minute}`;
  next();
};

const logHandler = (logger = identity) => (req, res, next) => {
  logger(req.method, ' : ', req.url);
  next();
};

const errorHandler = (req, res) => {
  res.status(404).end('Error 404');
  return;
};

const parseCookies = cookiesString => {
  const cookies = {};
  if (!cookiesString) {
    return cookies;
  }

  const cookieString = cookiesString.split(';');
  cookieString.forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookies[name.trim()] = value.trim();
  });
  return cookies;
};

const injectCookies = (req, res, next) => {
  const cookies = req.headers.cookie;
  req.cookies = parseCookies(cookies);
  next();
};


const injectSession = (sessions) => {
  return function (req, res, next) {
    if (!req.cookies) {
      next();
      return;
    }
    const { id } = req.cookies;
    if (sessions[id]) {
      req.session = sessions[id];
      next();
      return;
    }
    next();
  }
};

module.exports = { getTimeStamp, injectCookies, injectSession, logHandler, errorHandler };

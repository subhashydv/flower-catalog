const { URL } = require('url');

const getTimeStamp = (req, res, next) => {
  const time = new Date();
  const hour = time.getHours();
  const minute = time.getMinutes();
  const date = time.toDateString();
  req.timeStamp = `${date} ${hour}:${minute}`;
  next();
};

const logHandler = (req, res, next) => {
  console.log(req.method, ' : ', req.url.pathname);
  next();
};

const errorHandler = (req, res) => {
  res.statusCode = 404;
  res.end('Error 404');
  return true;
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


const bodyParams = params => {
  const queryParams = {};
  const entries = params.entries();
  for (const entry of entries) {
    queryParams[entry[0]] = entry[1];
  }
  return queryParams;
};

const parseBodyParams = (req, res, next) => {
  let data = '';
  req.setEncoding('utf8');
  req.on('data', chunk => data += chunk);

  req.on('end', () => {
    req.bodyParams = bodyParams(new URLSearchParams(data));
    next();
  });
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

const createUrl = req => `http://${req.headers.host}${req.url}`;

const parseUrl = (req, res, next) => {
  req.url = new URL(createUrl(req));
  next();
};

module.exports = { parseUrl, getTimeStamp, injectCookies, parseBodyParams, injectSession, logHandler, errorHandler };

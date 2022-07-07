const createSession = req => {
  const session = {};
  const { bodyParams } = req;
  const time = new Date();
  session.id = time.getTime();
  session.user = bodyParams.user;
  session.time = time;
  return session;
};

const isUserPresent = (req, userCred) => {
  const { user } = req.bodyParams;
  return userCred[user] ? true : false;
};

const loginPageHandler = loginPage => (req, res, next) => {
  const { session, url } = req;

  if (url.pathname === '/login' && req.method === 'GET') {
    if (!session) {
      res.end(loginPage);
      return;
    }
    res.statusCode = 302;
    res.setHeader('location', '/guestbook');
    res.end();
    return;
  }
  next();
};

const loginHandler = (sessions, userCred) => (req, res, next) => {
  const { pathname } = req.url;

  if (pathname === '/login' && req.method === 'POST') {
    if (!isUserPresent(req, userCred)) {
      res.statusCode = 302;
      res.setHeader('location', '/signup');
      res.end();
      return;
    }
    const session = createSession(req);
    const { id } = session;
    sessions[id] = session;
    res.setHeader('set-cookie', `id=${id}`);
    res.statusCode = 302;
    res.setHeader('location', '/guestbook')
    res.end();
    return;
  }

  next();
};

module.exports = { loginHandler, loginPageHandler };

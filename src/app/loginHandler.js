const createSession = req => {
  const session = {};
  const { user } = req.body;
  const time = new Date();
  session.id = time.getTime();
  session.user = user;
  session.time = time;
  return session;
};

const isUserPresent = (req, userCred) => {
  const { user } = req.body;
  return userCred[user] ? true : false;
};

const loginPageHandler = loginPage => (req, res, next) => {
  const { session, url } = req;

  if (url === '/login') {
    if (!session) {
      res.setHeader('content-type', 'text/html');
      res.end(loginPage);
      return;
    }
    res.redirect('/guestbook');
    res.end();
    return;
  }
  // next();
};

const loginHandler = (sessions, userCred) => (req, res, next) => {
  if (req.url === '/login') {
    if (!isUserPresent(req, userCred)) {
      res.redirect('/signup-page');
      res.end();
      return;
    }
    const session = createSession(req);
    const { id } = session;
    sessions[id] = session;
    res.cookie('id', id);
    res.redirect('/guestbook');
    res.end();
    return;
  }

  next();
};

module.exports = { loginHandler, loginPageHandler };

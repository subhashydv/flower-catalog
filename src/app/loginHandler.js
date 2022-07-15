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
  const { session } = req;
  if (!session) {
    res.set('content-type', 'text/html').end(loginPage);
    return;
  }
  res.redirect('/guestbook');
  return;
};

const loginHandler = (sessions, userCred) => (req, res, next) => {
  if (!isUserPresent(req, userCred)) {
    res.redirect('/signup');
    return;
  }
  const session = createSession(req);
  const { id } = session;
  sessions[id] = session;
  res.cookie('id', id).redirect('/guestbook');
  return;
};

module.exports = { loginHandler, loginPageHandler };

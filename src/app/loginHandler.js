const createSession = req => {
  const session = {};
  const { bodyParams } = req;
  const time = new Date();
  session.id = time.getTime();
  session.user = bodyParams.user;
  session.time = time;
  return session;
};

const loginContent = `<html>
<head>
  <title>login</title>
</head>
<body>
  <form action="login" method="post">
    <label for="name"></label>
    <input type="text" name="user" id="user">
    <input type="submit" value="Login">
  </form>
</body>
</html>`;

const loginPageHandler = (req, res, next) => {
  const { session, url } = req;

  if (url.pathname === '/login' && req.method === 'GET') {
    if (!session) {
      res.end(loginContent);
      return;
    } else {
      res.statusCode = 302;
      res.setHeader('location', '/guestbook');
      res.end();
      return;
    }
  }
  next();
};

const loginHandler = sessions => (req, res, next) => {
  const { pathname } = req.url;

  if (pathname === '/login' && req.method === 'POST') {
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

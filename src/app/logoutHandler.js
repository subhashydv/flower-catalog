const logoutHandler = sessions => (req, res, next) => {
  const { url, session } = req;
  if (url.pathname !== '/logout') {
    next();
    return;
  }

  if (!session) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  delete sessions[session];
  res.setHeader('set-cookie', `id=${session.id};max-age=0`);
  res.statusCode = 302;
  res.setHeader('location', '/');
  res.end();
  return;
};

module.exports = { logoutHandler };

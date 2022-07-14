const logoutHandler = sessions => (req, res, next) => {
  const { url, session } = req;
  if (url !== '/logout') {
    next();
    return;
  }

  console.log(session);
  if (!session) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
  }

  const id = session.id;
  res.clearCookie('id', id);
  delete sessions[session.id];
  res.redirect('/');
  res.end();
  return;
};

module.exports = { logoutHandler };

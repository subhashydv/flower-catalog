const logoutHandler = sessions => (req, res, next) => {
  const { session } = req;

  if (!session) {
    res.status(400).end('Bad request');
    return;
  }

  const id = session.id;
  delete sessions[session.id];
  res.clearCookie('id', id).redirect('/');
  return;
};

module.exports = { logoutHandler };

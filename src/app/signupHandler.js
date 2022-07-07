const signupForm = `<html>
<head>
  <title>login</title>
</head>

<body>
  <h1>Register Form</h1>
  <form action="signup" method="post">
    <label for="name">Enter Name : </label>
    <input type="text" name="user" id="user">
    <input type="submit" value="Register">
  </form>
</body>

</html>`;

const signupHandler = userCred => (req, res, next) => {
  const { pathname } = req.url;
  if (pathname === '/signup' && req.method === 'GET') {
    res.end(signupForm);
    return;
  }

  if (pathname === '/signup' && req.method === 'POST') {
    const { user } = req.bodyParams;
    userCred[user] = req.bodyParams;
    res.statusCode = 302;
    res.setHeader('location', '/login');
    res.end();
    return;
  }
  next();
};

module.exports = { signupHandler };

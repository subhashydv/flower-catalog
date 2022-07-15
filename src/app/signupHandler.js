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


const getSignupForm = (req, res, next) => {
  res.end(signupForm);
  return;
};

const signupHandler = userCred => (req, res, next) => {
  const { user } = req.body;
  userCred[user] = req.body;
  res.redirect('/login');
  return;
};

module.exports = { signupHandler, getSignupForm };

const authService = require("../services/auth.service");

const login = (req, res) => {
  const { username, password } = req.body;
  const user = authService.findUserByUsername(username);

  if (user && authService.validatePassword(password, user.password)) {
    const token = authService.generateToken(user);
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials!");
  }
};

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    authService.verifyToken(token, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const protectedRoute = (req, res) => {
  res.send(`Hello ${req.user.username}, you have accessed a protected route!`);
};

module.exports = {
  login,
  authenticateJWT,
  protectedRoute,
};

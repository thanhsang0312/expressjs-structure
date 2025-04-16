const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const SECRET_KEY = "your_jwt_secret";

const users = [
  { id: 1, username: "user1", password: bcrypt.hashSync("password1", 8) },
];

const findUserByUsername = (username) => {
  return users.find((user) => user.username === username);
};

const validatePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

const verifyToken = (token, callback) => {
  jwt.verify(token, SECRET_KEY, callback);
};

module.exports = {
  findUserByUsername,
  validatePassword,
  generateToken,
  verifyToken,
};

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/database");

const SECRET_KEY = process.env.JWT_SECRET || "your_jwt_secret";

const findUserByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
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

const createUser = async (username, password) => {
  // Check if username already exists
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const [result] = await db.query(
    'INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)',
    [username, hashedPassword, new Date()]
  );

  return {
    id: result.insertId,
    username,
    createdAt: new Date()
  };
};

const checkUserExists = async (username) => {
  const [rows] = await db.query('SELECT COUNT(*) as count FROM users WHERE username = ?', [username]);
  return rows[0].count > 0;
};

module.exports = {
  findUserByUsername,
  validatePassword,
  generateToken,
  verifyToken,
  createUser,
  checkUserExists,
};

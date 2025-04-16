const authService = require("../services/auth.service");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       400:
 *         description: Username already exists
 */
const register = (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = authService.createUser(username, password);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.message === 'Username already exists') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to the application
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user1
 *               password:
 *                 type: string
 *                 example: password1
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
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

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: Access protected route
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully accessed protected route
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
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
  register,
  login,
  authenticateJWT,
  protectedRoute,
};

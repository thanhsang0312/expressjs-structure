const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/login', authController.login);
router.get('/protected', authController.authenticateJWT, authController.protectedRoute);

module.exports = router;
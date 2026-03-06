const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

// POST /auth/signup
router.post('/signup', authController.signup);

// POST /auth/login
router.post('/login', authController.login);

// POST /auth/logout
router.post('/logout', authController.logout);

module.exports = router;
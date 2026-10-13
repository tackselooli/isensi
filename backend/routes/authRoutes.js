const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/authController');

// JWT token route
router.post('/api/set-token', authController.setToken);

// Verify JWT route
router.get('/api/verify-token', authController.verifyToken);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

module.exports = router;

const express = require('express');
const { verifyJWT, verifyAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

// Protected route
router.get('/protected-route', verifyJWT, (req, res) => {
  res.send({ message: "This is a protected route", user: req.decoded });
});

// New user
router.post('/new-user', userController.createUser);

// Get all users
router.get('/users', verifyJWT, userController.getAllUsers);

// Get user by ID
router.get('/users/:id', verifyJWT, userController.getUserById);

// Update user
router.put('/update-user/:id', verifyJWT, verifyAdmin, userController.updateUser);

// Delete user
router.delete('/delete-user/:id', verifyJWT, verifyAdmin, userController.deleteUser);

module.exports = router;

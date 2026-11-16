const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middlewares/auth.middleware');
const authController = require('../controllers/auth.controller');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get current user
router.get('/me', authenticateToken, authController.getCurrentUser);

router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have accessed a protected route.',
        user: req.user
    });
});

module.exports = router;
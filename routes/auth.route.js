const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
// const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected route example
// router.get('/profile', authMiddleware, (req, res) => {
//   res.send({ message: 'This is a protected route', user: req.user });
// });     

module.exports = router;

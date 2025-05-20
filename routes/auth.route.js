const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
// const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected route example
// router.get('/profile', authMiddleware, (req, res) => {
//   res.send({ message: 'This is a protected route', user: req.user });
// });     

module.exports = router;

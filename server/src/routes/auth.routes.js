// src/routes/auth.routes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const registerRules = [
  body('fullName').notEmpty().withMessage('Nama lengkap tidak boleh kosong'),
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
];

const loginRules = [
  body('email').isEmail().withMessage('Format email tidak valid'),
  body('password').notEmpty().withMessage('Password tidak boleh kosong'),
];

router.post('/register', registerRules, authController.register);
router.post('/login', loginRules, authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
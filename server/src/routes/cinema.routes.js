// File: src/routes/cinema.routes.js

const express = require('express');
const { body } = require('express-validator');
const cinemaController = require('../controllers/cinema.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Rute Publik
router.get('/', cinemaController.getAllCinemas);
router.get('/:id', cinemaController.getCinemaById);

// Aturan validasi
const cinemaRules = [
  body('name').notEmpty().withMessage('Nama bioskop tidak boleh kosong'),
  body('city').notEmpty().withMessage('Kota tidak boleh kosong'),
  body('address').notEmpty().withMessage('Alamat tidak boleh kosong'),
];

// Rute Admin (Membutuhkan Token)
router.post('/', authMiddleware, cinemaRules, cinemaController.createCinema);
router.put('/:id', authMiddleware, cinemaController.updateCinema);
router.delete('/:id', authMiddleware, cinemaController.deleteCinema);

module.exports = router;
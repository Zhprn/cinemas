// File: src/routes/showtime.routes.js

const express = require('express');
const { body } = require('express-validator');
const showtimeController = require('../controllers/showtime.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Rute Publik
// URL contoh: GET /api/showtimes?movieId=1&city=Padang&date=2025-09-29
router.get('/', showtimeController.getAllShowtimes);
router.get('/:id', showtimeController.getShowtimeById);

// Aturan validasi
const showtimeRules = [
  body('movieId').isInt().withMessage('Movie ID harus angka'),
  body('auditoriumId').isInt().withMessage('Auditorium ID harus angka'),
  body('startTime').isISO8601().withMessage('Format waktu mulai tidak valid (YYYY-MM-DDTHH:mm:ss.sssZ)'),
  body('price').isFloat({ gt: 0 }).withMessage('Harga harus angka positif'),
];

// Rute Admin (Membutuhkan Token)
router.post('/', authMiddleware, showtimeRules, showtimeController.createShowtime);
router.delete('/:id', authMiddleware, showtimeController.deleteShowtime);

module.exports = router;
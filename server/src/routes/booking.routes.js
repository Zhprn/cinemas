// File: src/routes/booking.routes.js

const express = require('express');
const { body } = require('express-validator');
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

const bookingRules = [
  body('showtimeId').isInt().withMessage('Showtime ID harus angka'),
  body('seats').isArray({ min: 1 }).withMessage('Harus memilih minimal 1 kursi'),
  body('seats.*.row').isString().notEmpty().withMessage('Baris kursi harus diisi'),
  body('seats.*.number').isInt().withMessage('Nomor kursi harus angka'),
];

// --- RUTE BARU DI SINI ---
// GET /api/bookings/all -> (Admin) Melihat semua booking di sistem
router.get('/all', bookingController.getAllBookings);

// POST /api/bookings -> Membuat booking baru
router.post('/', bookingRules, bookingController.createBooking);

// GET /api/bookings -> (User) Melihat riwayat booking miliknya
router.get('/', bookingController.getUserBookings);

// GET /api/bookings/:id -> (User) Melihat detail satu booking miliknya
router.get('/:id', bookingController.getBookingById);

module.exports = router;
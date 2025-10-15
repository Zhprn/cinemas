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

router.get('/all', bookingController.getAllBookings);

router.post('/', bookingRules, bookingController.createBooking);

router.get('/', bookingController.getUserBookings);

router.get('/:id', bookingController.getBookingById);

module.exports = router;
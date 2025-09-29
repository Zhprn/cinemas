// File: src/controllers/booking.controller.js

const bookingService = require('../services/booking.service');
const { validationResult } = require('express-validator');

const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.userId;
    const { showtimeId, seats } = req.body;

    const bookingData = { userId, showtimeId, seats };
    const newBooking = await bookingService.createBooking(bookingData);

    res.status(201).json({
      message: 'Booking berhasil dibuat!',
      data: newBooking,
    });
  } catch (error) {
    if (error.message.includes('sudah dipesan')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await bookingService.findBookingsByUserId(userId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookingId = parseInt(req.params.id);
    const booking = await bookingService.findBookingById(bookingId, userId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking tidak ditemukan atau bukan milik Anda.' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- FUNGSI BARU DI SINI ---
/**
 * Mengambil semua booking (Admin).
 */
const getAllBookings = async (req, res) => {
  try {
    // Di aplikasi nyata, tambahkan pengecekan role admin di sini
    // if (req.user.role !== 'ADMIN') {
    //   return res.status(403).json({ message: 'Akses ditolak.' });
    // }
    const allBookings = await bookingService.findAllBookings();
    res.status(200).json(allBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  getAllBookings, // Ekspor fungsi baru
};
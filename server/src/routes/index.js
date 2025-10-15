const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const movieRoutes = require('./movie.routes');
const cinemaRoutes = require('./cinema.routes');
const showtimeRoutes = require('./showtime.routes');
const auditoriumRoutes = require('./auditorium.routes');
const bookingRoutes = require('./booking.routes')

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/cinemas', cinemaRoutes);
router.use('/showtimes', showtimeRoutes);
router.use('/auditoriums', auditoriumRoutes); 
router.use('/bookings', bookingRoutes);

module.exports = router;
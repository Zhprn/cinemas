// File: src/controllers/showtime.controller.js

const showtimeService = require('../services/showtime.service');
const { validationResult } = require('express-validator');

const getAllShowtimes = async (req, res) => {
  try {
    // Ambil semua filter dari query URL
    const filters = {
      movieId: req.query.movieId,
      city: req.query.city,
      date: req.query.date,
    };

    const showtimes = await showtimeService.findAllShowtimes(filters);

    // (Opsional) Kelompokkan hasil berdasarkan bioskop untuk frontend
    const groupedByCinema = showtimes.reduce((acc, showtime) => {
      const cinemaName = showtime.auditorium.cinema.name;
      if (!acc[cinemaName]) {
        acc[cinemaName] = {
          cinema: showtime.auditorium.cinema,
          schedules: [],
        };
      }
      acc[cinemaName].schedules.push({
        showtimeId: showtime.id,
        startTime: showtime.startTime,
        price: showtime.price,
        auditoriumName: showtime.auditorium.name,
        movieTitle: showtime.movie.title, // Sertakan info film jika perlu
      });
      return acc;
    }, {});

    res.status(200).json(Object.values(groupedByCinema));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createShowtime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const showtimeData = req.body;
    const newShowtime = await showtimeService.insertShowtime(showtimeData);
    res.status(201).json({
      message: 'Jadwal tayang baru berhasil ditambahkan!',
      data: newShowtime,
    });
  } catch (error) {
    // Tangkap error spesifik dari service (misal: jadwal tumpang tindih)
    res.status(409).json({ message: error.message }); // 409 Conflict
  }
};

const deleteShowtime = async (req, res) => {
  try {
    const showtimeId = parseInt(req.params.id);
    await showtimeService.deleteShowtime(showtimeId);
    res.status(200).json({ message: 'Jadwal tayang berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Jadwal tayang tidak ditemukan.' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllShowtimes,
  createShowtime,
  deleteShowtime,
};
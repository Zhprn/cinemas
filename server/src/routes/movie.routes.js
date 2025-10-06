const express = require('express');
const { body } = require('express-validator');
const movieController = require('../controllers/movie.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router(); // Pastikan Anda membuat router

// Rute Publik (tidak perlu login)
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

// Aturan validasi untuk film baru
const createMovieRules = [
  body('title').notEmpty().withMessage('Judul tidak boleh kosong'),
  body('description').notEmpty().withMessage('Deskripsi tidak boleh kosong'),
  body('releaseDate').isISO8601().toDate().withMessage('Format tanggal tidak valid'),
  body('durationMinutes').isInt({ gt: 0 }).withMessage('Durasi harus angka positif'),
];

// Rute yang Membutuhkan Login
router.post(
  '/',
  authMiddleware,
  upload.single('posterImage'),
  createMovieRules,
  movieController.createMovie
);

router.put(
  '/:id',
  authMiddleware,
  upload.single('posterImage'),
  movieController.updateMovie
);

router.delete('/:id', authMiddleware, movieController.deleteMovie);

module.exports = router;
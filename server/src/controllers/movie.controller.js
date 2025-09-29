const movieService = require('../services/movie.service');
const { validationResult } = require('express-validator');
const fs = require('fs'); // Modul File System dari Node.js
const path = require('path');

/**
 * Mengambil semua film, dengan filter opsional berdasarkan status.
 * URL: GET /api/movies?status=now_showing
 */
const getAllMovies = async (req, res) => {
  try {
    const { status } = req.query; // Ambil filter dari query URL
    const movies = await movieService.findAllMovies(status);
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

/**
 * Mengambil satu film spesifik berdasarkan ID.
 * URL: GET /api/movies/1
 */
const getMovieById = async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'ID Film tidak valid.' });
    }

    const movie = await movieService.findMovieById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Film tidak ditemukan.' });
    }

    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

/**
 * Membuat film baru dengan unggahan gambar.
 * URL: POST /api/movies
 */
const createMovie = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Gambar poster wajib diunggah.' });
  }

  try {
    const movieData = req.body;
    const posterUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    movieData.posterUrl = posterUrl;
    
    // Konversi tipe data dari form-data (yang semuanya string)
    movieData.durationMinutes = parseInt(movieData.durationMinutes);
    movieData.releaseDate = new Date(movieData.releaseDate);
    movieData.isShowing = movieData.isShowing === 'true';

    const newMovie = await movieService.insertMovie(movieData);
    res.status(201).json({
      message: 'Film baru berhasil ditambahkan!',
      data: newMovie,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

/**
 * Memperbarui data film berdasarkan ID.
 * URL: PUT /api/movies/1
 */
const updateMovie = async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    const movieData = req.body;

    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'ID Film tidak valid.' });
    }

    if (req.file) {
      const posterUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      movieData.posterUrl = posterUrl;

      const existingMovie = await movieService.findMovieById(movieId);
      if (existingMovie && existingMovie.posterUrl) {
        const oldFilename = path.basename(existingMovie.posterUrl);
        fs.unlink(`uploads/${oldFilename}`, (err) => {
          if (err) console.error("Gagal menghapus gambar lama:", err);
        });
      }
    }
    
    if (movieData.durationMinutes) movieData.durationMinutes = parseInt(movieData.durationMinutes);
    if (movieData.releaseDate) movieData.releaseDate = new Date(movieData.releaseDate);
    if (movieData.isShowing) movieData.isShowing = movieData.isShowing === 'true';

    const updatedMovie = await movieService.updateMovie(movieId, movieData);
    res.status(200).json({
      message: 'Film berhasil diperbarui!',
      data: updatedMovie,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Film yang akan diupdate tidak ditemukan.' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

/**
 * Menghapus film berdasarkan ID.
 * URL: DELETE /api/movies/1
 */
const deleteMovie = async (req, res) => {
  try {
    const movieId = parseInt(req.params.id);
    if (isNaN(movieId)) {
      return res.status(400).json({ message: 'ID Film tidak valid.' });
    }

    const movie = await movieService.findMovieById(movieId);
    if (movie && movie.posterUrl) {
      const filename = path.basename(movie.posterUrl);
      fs.unlink(`uploads/${filename}`, (err) => {
        if (err) console.error("Gagal menghapus gambar:", err);
      });
    }

    await movieService.deleteMovie(movieId);
    res.status(200).json({ message: 'Film berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Film tidak ditemukan.' });
    }
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// Ekspor semua fungsi agar bisa digunakan di file rute
module.exports = {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
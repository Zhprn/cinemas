// File: src/controllers/cinema.controller.js

const cinemaService = require('../services/cinema.service');
const { validationResult } = require('express-validator');

const getAllCinemas = async (req, res) => {
  try {
    const { city } = req.query; // Ambil filter kota dari URL
    const cinemas = await cinemaService.findAllCinemas(city);
    res.status(200).json(cinemas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCinemaById = async (req, res) => {
  try {
    const cinemaId = parseInt(req.params.id);
    const cinema = await cinemaService.findCinemaById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ message: 'Bioskop tidak ditemukan.' });
    }
    res.status(200).json(cinema);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCinema = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const cinemaData = req.body;
    const newCinema = await cinemaService.insertCinema(cinemaData);
    res.status(201).json({
      message: 'Bioskop baru berhasil ditambahkan!',
      data: newCinema,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCinema = async (req, res) => {
  try {
    const cinemaId = parseInt(req.params.id);
    const cinemaData = req.body;
    const updatedCinema = await cinemaService.updateCinema(cinemaId, cinemaData);
    res.status(200).json({
      message: 'Data bioskop berhasil diperbarui!',
      data: updatedCinema,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Bioskop tidak ditemukan.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteCinema = async (req, res) => {
  try {
    const cinemaId = parseInt(req.params.id);
    await cinemaService.deleteCinema(cinemaId);
    res.status(200).json({ message: 'Bioskop berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Bioskop tidak ditemukan.' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
};
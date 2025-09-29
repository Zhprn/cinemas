const auditoriumService = require('../services/auditorium.service');
const { validationResult } = require('express-validator');

const createAuditorium = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const auditoriumData = req.body;
    const newAuditorium = await auditoriumService.insertAuditorium(auditoriumData);
    res.status(201).json({
      message: 'Auditorium baru berhasil ditambahkan!',
      data: newAuditorium,
    });
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(404).json({ message: 'Bioskop dengan ID tersebut tidak ditemukan.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const getAllAuditoriums = async (req, res) => {
  try {
    const { cinemaId } = req.query;
    if (!cinemaId) {
      return res.status(400).json({ message: 'Parameter cinemaId wajib diisi.' });
    }

    const auditoriums = await auditoriumService.findAuditoriumsByCinemaId(parseInt(cinemaId));
    res.status(200).json(auditoriums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAuditoriumById = async (req, res) => {
  try {
    const auditoriumId = parseInt(req.params.id);
    const auditorium = await auditoriumService.findAuditoriumById(auditoriumId);
    if (!auditorium) {
      return res.status(404).json({ message: 'Auditorium tidak ditemukan.' });
    }
    res.status(200).json(auditorium);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAuditorium = async (req, res) => {
  try {
    const auditoriumId = parseInt(req.params.id);
    const auditoriumData = req.body;
    const updatedAuditorium = await auditoriumService.updateAuditorium(auditoriumId, auditoriumData);
    res.status(200).json({
      message: 'Data auditorium berhasil diperbarui!',
      data: updatedAuditorium,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Auditorium tidak ditemukan.' });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteAuditorium = async (req, res) => {
  try {
    const auditoriumId = parseInt(req.params.id);
    await auditoriumService.deleteAuditorium(auditoriumId);
    res.status(200).json({ message: 'Auditorium berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Auditorium tidak ditemukan.' });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAuditorium,
  getAllAuditoriums,
  getAuditoriumById,
  updateAuditorium,
  deleteAuditorium,
};
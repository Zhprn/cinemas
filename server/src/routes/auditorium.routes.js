// File: src/routes/auditorium.routes.js

const express = require('express');
const { body } = require('express-validator');
const auditoriumController = require('../controllers/auditorium.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', auditoriumController.getAllAuditoriums);
router.get('/:id', auditoriumController.getAuditoriumById);

const auditoriumRules = [
  body('name').notEmpty().withMessage('Nama auditorium tidak boleh kosong'),
  body('cinemaId').isInt().withMessage('Cinema ID harus berupa angka'),
  
  body('seatLayout').isObject().withMessage('Seat layout harus berupa objek'),
  
  body('seatLayout.rows').isInt({ gt: 0 }).withMessage('Baris kursi harus angka positif'),
  body('seatLayout.cols').isInt({ gt: 0 }).withMessage('Kolom kursi harus angka positif'),
];

router.post('/', authMiddleware, auditoriumRules, auditoriumController.createAuditorium);
router.put('/:id', authMiddleware, auditoriumController.updateAuditorium);
router.delete('/:id', authMiddleware, auditoriumController.deleteAuditorium);

module.exports = router;
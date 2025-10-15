const express = require('express');
const { body } = require('express-validator');
const cinemaController = require('../controllers/cinema.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', cinemaController.getAllCinemas);
router.get('/:id', cinemaController.getCinemaById);

const cinemaRules = [
  body('name').notEmpty().withMessage('Nama bioskop tidak boleh kosong'),
  body('city').notEmpty().withMessage('Kota tidak boleh kosong'),
  body('address').notEmpty().withMessage('Alamat tidak boleh kosong'),
];

router.post('/', authMiddleware, cinemaRules, cinemaController.createCinema);
router.put('/:id', authMiddleware, cinemaController.updateCinema);
router.delete('/:id', authMiddleware, cinemaController.deleteCinema);

module.exports = router;
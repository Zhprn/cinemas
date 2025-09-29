// File: src/middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
const { isTokenBlocklisted } = require('../services/blocklist.service');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Format token salah.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // --- PENGECEKAN BARU ---
    // Cek apakah token ada di blocklist
    if (isTokenBlocklisted(decoded.jti)) {
      return res.status(401).json({ message: 'Token tidak valid (telah logout).' });
    }

    req.user = decoded; // Simpan data user dari token ke request
    next(); // Lanjutkan ke controller
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
  }
};

module.exports = authMiddleware;
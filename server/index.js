require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // 1. Impor modul 'path'

// Impor file rute utama dari folder src
const allRoutes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Middleware untuk parsing form data

// --- PERUBAHAN DI SINI ---
// 2. Middleware untuk menyajikan file statis dari folder 'uploads'
// Ini membuat URL gambar yang tersimpan di database bisa diakses oleh browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute untuk mengecek apakah server berjalan (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the TIX ID API! 🍿',
  });
});

// Gunakan semua rute dari file ./src/routes dengan prefix /api
app.use('/api', allRoutes);

// Jalankan Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running and listening on http://localhost:${PORT}`);
});
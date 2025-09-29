// File: src/services/cinema.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Mengambil semua data bioskop.
 * @param {string} city - Filter opsional berdasarkan kota.
 * @returns {Promise<Cinema[]>}
 */
const findAllCinemas = async (city) => {
  const whereClause = {};
  if (city) {
    whereClause.city = city;
  }
  return await prisma.cinema.findMany({ where: whereClause });
};

/**
 * Mengambil satu bioskop berdasarkan ID, termasuk data auditoriumnya.
 * @param {number} cinemaId - ID dari bioskop.
 * @returns {Promise<Cinema|null>}
 */
const findCinemaById = async (cinemaId) => {
  return await prisma.cinema.findUnique({
    where: { id: cinemaId },
    include: {
      auditoriums: true, // Sertakan data auditorium yang terkait
    },
  });
};

/**
 * Menambahkan data bioskop baru.
 * @param {object} cinemaData - Data bioskop baru.
 * @returns {Promise<Cinema>}
 */
const insertCinema = async (cinemaData) => {
  return await prisma.cinema.create({
    data: cinemaData,
  });
};

/**
 * Memperbarui data bioskop berdasarkan ID.
 * @param {number} cinemaId - ID bioskop yang akan diupdate.
 * @param {object} cinemaData - Data baru untuk bioskop.
 * @returns {Promise<Cinema>}
 */
const updateCinema = async (cinemaId, cinemaData) => {
  return await prisma.cinema.update({
    where: { id: cinemaId },
    data: cinemaData,
  });
};

/**
 * Menghapus data bioskop berdasarkan ID.
 * @param {number} cinemaId - ID bioskop yang akan dihapus.
 * @returns {Promise<Cinema>}
 */
const deleteCinema = async (cinemaId) => {
  return await prisma.cinema.delete({
    where: { id: cinemaId },
  });
};

module.exports = {
  findAllCinemas,
  findCinemaById,
  insertCinema,
  updateCinema,
  deleteCinema,
};
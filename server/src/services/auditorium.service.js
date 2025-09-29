// File: src/services/auditorium.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Membuat auditorium baru untuk sebuah bioskop.
 * @param {object} auditoriumData - Data auditorium (name, seatLayout, cinemaId).
 * @returns {Promise<Auditorium>}
 */
const insertAuditorium = async (auditoriumData) => {
  return await prisma.auditorium.create({
    data: auditoriumData,
  });
};

/**
 * Menemukan semua auditorium berdasarkan ID bioskop.
 * @param {number} cinemaId - ID dari bioskop.
 * @returns {Promise<Auditorium[]>}
 */
const findAuditoriumsByCinemaId = async (cinemaId) => {
  return await prisma.auditorium.findMany({
    where: {
      cinemaId: cinemaId,
    },
  });
};

/**
 * Menemukan satu auditorium berdasarkan ID-nya.
 * @param {number} auditoriumId - ID dari auditorium.
 * @returns {Promise<Auditorium|null>}
 */
const findAuditoriumById = async (auditoriumId) => {
  return await prisma.auditorium.findUnique({
    where: { id: auditoriumId },
  });
};

/**
 * Memperbarui data auditorium.
 * @param {number} auditoriumId - ID auditorium.
 * @param {object} auditoriumData - Data baru untuk auditorium.
 * @returns {Promise<Auditorium>}
 */
const updateAuditorium = async (auditoriumId, auditoriumData) => {
  return await prisma.auditorium.update({
    where: { id: auditoriumId },
    data: auditoriumData,
  });
};

/**
 * Menghapus auditorium.
 * @param {number} auditoriumId - ID auditorium.
 * @returns {Promise<Auditorium>}
 */
const deleteAuditorium = async (auditoriumId) => {
  return await prisma.auditorium.delete({
    where: { id: auditoriumId },
  });
};

module.exports = {
  insertAuditorium,
  findAuditoriumsByCinemaId,
  findAuditoriumById,
  updateAuditorium,
  deleteAuditorium,
};
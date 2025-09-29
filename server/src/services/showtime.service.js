// File: src/services/showtime.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { addMinutes, startOfDay, endOfDay } = require('date-fns');

const findAllShowtimes = async (filters) => {
  const { movieId, city, date } = filters;
  const whereClause = {};

  if (movieId) {
    whereClause.movieId = parseInt(movieId);
  }

  if (city) {
    whereClause.auditorium = {
      cinema: {
        city: city,
      },
    };
  }

  if (date) {
    const searchDate = new Date(date);
    whereClause.startTime = {
      gte: startOfDay(searchDate),
      lte: endOfDay(searchDate),
    };
  }

  return await prisma.showtime.findMany({
    where: whereClause,
    include: {
      movie: {
        select: { title: true, durationMinutes: true, rating: true },
      },
      auditorium: {
        include: {
          cinema: true,
        },
      },
    },
    orderBy: {
      startTime: 'asc',
    },
  });
};

const insertShowtime = async (showtimeData) => {
  const { movieId, auditoriumId, startTime, price } = showtimeData;

  const movie = await prisma.movie.findUnique({ where: { id: movieId } });
  if (!movie) {
    throw new Error('Film tidak ditemukan.');
  }
  // Hitung endTime
  const endTime = addMinutes(new Date(startTime), movie.durationMinutes);

  // Cek jadwal tumpang tindih menggunakan endTime
  const overlappingShowtime = await prisma.showtime.findFirst({
    where: {
      auditoriumId: auditoriumId,
      OR: [
        {
          startTime: { lte: endTime },
          endTime: { gte: new Date(startTime) },
        },
      ],
    },
  });

  if (overlappingShowtime) {
    throw new Error('Jadwal tumpang tindih dengan jadwal yang sudah ada.');
  }

  // Buat jadwal baru dan sertakan endTime
  return await prisma.showtime.create({
    data: {
      movieId,
      auditoriumId,
      startTime: new Date(startTime),
      endTime, // <-- endTime sekarang disertakan
      price,
    },
  });
};

const deleteShowtime = async (showtimeId) => {
  return await prisma.showtime.delete({
    where: { id: showtimeId },
  });
};

module.exports = {
  findAllShowtimes,
  insertShowtime,
  deleteShowtime,
};
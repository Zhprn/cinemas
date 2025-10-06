const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfDay, endOfDay } = require('date-fns');

const findAllMovies = async (status) => {
  const whereClause = {};

  if (status === 'now_showing') {
    whereClause.isShowing = true;
  } else if (status === 'coming_soon') {
    whereClause.isShowing = false;
  }

  return await prisma.movie.findMany({
    where: whereClause,
  });
};

const findMovieById = async (movieId) => {
  const movieWithShowtimes = await prisma.movie.findUnique({
    where: {
      id: movieId,
    },
    include: {
      showtimes: {
        // HAPUS FILTER 'where' UNTUK TANGGAL DI SINI
        include: {
          auditorium: {
            include: {
              cinema: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      },
    },
  });

  if (!movieWithShowtimes) {
    return null;
  }

  // Logika pengelompokan tidak perlu diubah
  const schedulesByCinema = movieWithShowtimes.showtimes.reduce((acc, showtime) => {
    const cinemaId = showtime.auditorium.cinema.id;
    let cinemaGroup = acc.find((group) => group.cinema.id === cinemaId);
    if (!cinemaGroup) {
      cinemaGroup = {
        cinema: showtime.auditorium.cinema,
        showtimes: [],
      };
      acc.push(cinemaGroup);
    }
    cinemaGroup.showtimes.push({
      id: showtime.id,
      startTime: showtime.startTime,
      price: showtime.price,
      auditoriumName: showtime.auditorium.name,
    });
    return acc;
  }, []);

  const { showtimes, ...movieDetails } = movieWithShowtimes;

  return {
    movie: movieDetails,
    schedules: schedulesByCinema,
  };
};

const insertMovie = async (movieData) => {
  return await prisma.movie.create({
    data: movieData,
  });
};

const updateMovie = async (movieId, movieData) => {
  return await prisma.movie.update({
    where: { id: movieId },
    data: movieData,
  });
};

const deleteMovie = async (movieId) => {
  return await prisma.movie.delete({
    where: { id: movieId },
  });
};

module.exports = {
  findAllMovies,
  findMovieById,
  insertMovie,
  updateMovie,
  deleteMovie,
};
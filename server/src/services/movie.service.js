const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
  return await prisma.movie.findUnique({
    where: {
      id: movieId,
    },

  });
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
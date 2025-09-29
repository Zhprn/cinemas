const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Mencari user berdasarkan alamat email.
 * @param {string} email - Alamat email user.
 * @returns {Promise<User|null>}
 */
const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

/**
 * Membuat user baru di database.
 * @param {object} userData - Data user (fullName, email, password).
 * @returns {Promise<User>}
 */
const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

module.exports = {
  findUserByEmail,
  createUser,
};
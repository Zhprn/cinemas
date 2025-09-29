// File: src/services/booking.service.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { randomBytes } = require('crypto');

const createBooking = async (bookingData) => {
  const { userId, showtimeId, seats } = bookingData;

  return prisma.$transaction(async (tx) => {
    const existingBookedSeats = await tx.bookedSeat.findMany({
      where: {
        showtimeId: showtimeId,
        OR: seats.map((seat) => ({
          seatRow: seat.row,
          seatNumber: seat.number,
        })),
      },
    });

    if (existingBookedSeats.length > 0) {
      const takenSeats = existingBookedSeats.map(s => `${s.seatRow}${s.seatNumber}`).join(', ');
      throw new Error(`Kursi ${takenSeats} sudah dipesan. Silakan pilih kursi lain.`);
    }

    const showtime = await tx.showtime.findUnique({ where: { id: showtimeId } });
    if (!showtime) {
      throw new Error('Jadwal tayang tidak ditemukan.');
    }
    const totalPrice = seats.length * showtime.price;

    const newBooking = await tx.booking.create({
      data: {
        userId: userId,
        showtimeId: showtimeId,
        totalPrice: totalPrice,
        status: 'PAID',
        bookingCode: `TIX-${randomBytes(4).toString('hex').toUpperCase()}`,
      },
    });

    const seatsToBook = seats.map((seat) => ({
      bookingId: newBooking.id,
      showtimeId: showtimeId,
      seatRow: seat.row,
      seatNumber: seat.number,
    }));

    await tx.bookedSeat.createMany({
      data: seatsToBook,
    });

    return newBooking;
  });
};

const findBookingsByUserId = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      showtime: {
        include: {
          movie: true,
          auditorium: {
            include: {
              cinema: true,
            },
          },
        },
      },
      bookedSeats: true,
    },
  });
};

const findBookingById = async (bookingId, userId) => {
  return await prisma.booking.findUnique({
    where: {
      id: bookingId,
      userId: userId,
    },
    include: {
      showtime: {
        include: {
          movie: true,
          auditorium: {
            include: {
              cinema: true,
            },
          },
        },
      },
      bookedSeats: true,
    },
  });
};

// --- FUNGSI BARU DI SINI ---
/**
 * Mengambil semua booking dari database (untuk admin).
 * @returns {Promise<Booking[]>}
 */
const findAllBookings = async () => {
  return await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { // Sertakan data user yang melakukan booking
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      showtime: {
        include: {
          movie: {
            select: { title: true },
          },
        },
      },
    },
  });
};


module.exports = {
  createBooking,
  findBookingsByUserId,
  findBookingById,
  findAllBookings, // Ekspor fungsi baru
};
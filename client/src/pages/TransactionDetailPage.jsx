import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import QRCode from 'react-qr-code'; // <-- Impor QRCode

function TransactionDetailPage() {
  const { id: bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchBookingDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${bookingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBooking(response.data);
      } catch (err) {
        setError('Gagal memuat detail transaksi.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetail();
  }, [bookingId, navigate]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!booking) return <div className="p-10 text-center">Transaksi tidak ditemukan.</div>;

  const { showtime, bookedSeats, totalPrice } = booking;
  const seatCount = bookedSeats.length;
  const serviceFee = 3000 * seatCount;
  // Contoh data statis
  const promo = 50000;
  const finalPrice = totalPrice + serviceFee - promo;

  // Nilai untuk QR Code bisa berupa kode booking atau URL unik
  const qrCodeValue = booking.bookingCode; 

  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">Detail Transaksi</h1>

        {/* --- Kartu Tiket --- */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Bagian Atas (Biru) */}
          <div className="bg-blue-900 p-6 text-white">
            <h2 className="text-xl font-bold">{showtime.movie.title}</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-blue-800 pt-4">
              <div>
                <p className="text-xs text-blue-200">Lokasi</p>
                <p className="font-semibold">{showtime.auditorium.cinema.name}</p>
              </div>
              <div>
                <p className="text-xs text-blue-200">Kelas</p>
                <p className="font-semibold">{showtime.auditorium.name}</p>
              </div>
              <div>
                <p className="text-xs text-blue-200">Tanggal</p>
                <p className="font-semibold">{format(new Date(showtime.startTime), 'dd MMMM yyyy', { locale: localeId })}</p>
              </div>
              <div>
                <p className="text-xs text-blue-200">Jam</p>
                <p className="font-semibold">{format(new Date(showtime.startTime), 'HH:mm')}</p>
              </div>
            </div>
          </div>
          {/* Bagian Bawah (Kuning) */}
          <div className="relative bg-amber-400 p-6">
            <div className="flex justify-between items-center"> {/* Tambah items-center */}
              <div>
                <div className="mb-3">
                  <p className="text-xs font-bold text-amber-800">Kode Booking</p>
                  <p className="font-mono font-bold text-gray-800">{booking.bookingCode}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-amber-800">Kursi</p>
                  <p className="font-mono font-bold text-gray-800">{bookedSeats.map(s => `${s.seatRow}${s.seatNumber}`).join(', ')}</p>
                </div>
              </div>
              <div className="flex items-center justify-center rounded-lg bg-white p-2 shadow-md"> {/* Container untuk QR Code */}
                {/* Menampilkan QR Code */}
                <QRCode value={qrCodeValue} size={96} level="H" /> 
              </div>
            </div>
            {/* Efek sobekan kertas */}
            <div className="absolute -top-3 left-0 flex w-full justify-between px-6"> {/* Tambah px-6 */}
              <div className="h-6 w-6 rounded-full bg-gray-100"></div>
              <div className="h-6 w-6 rounded-full bg-gray-100"></div>
            </div>
          </div>
        </div>

        {/* --- Rincian Pembelian --- */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800">Rincian Pembelian</h2>
          <div className="mt-4 space-y-3 border-b pb-4 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>NO ORDER</span>
              <span>{booking.bookingCode}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>REGULAR SEAT</span>
              <span>Rp. {showtime.price.toLocaleString('id-ID')} x{seatCount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>BIAYA LAYANAN</span>
              <span>Rp. 3.000 x{seatCount}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>PROMO TIX ID</span>
              <span className="text-red-500">- Rp. {promo.toLocaleString('id-ID')}</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between font-bold">
            <span>TOTAL PEMBAYARAN</span>
            <span>Rp. {finalPrice.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <button onClick={() => navigate(-1)} className="mt-8 flex items-center gap-2 font-bold text-gray-600 hover:text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
          Kembali
        </button>
      </div>
    </div>
  );
}

export default TransactionDetailPage;
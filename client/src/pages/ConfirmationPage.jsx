import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import axios from 'axios';

// Komponen untuk pilihan metode pembayaran
function PaymentOption({ name, icon, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`mt-3 flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
        isSelected ? 'border-blue-600 ring-2 ring-blue-500' : 'border-gray-300 hover:bg-gray-50'
      }`}
    >
      <img src={icon} alt={name} className="h-6 object-contain"/>
      <span className="font-bold text-gray-800">{name}</span>
    </button>
  );
}

function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { showtimeData, selectedSeats } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [isProcessing, setIsProcessing] = useState(false);

  // Perbaikan 1: 'useEffect' dipanggil di level atas sesuai aturan React
  useEffect(() => {
    if (!showtimeData || !selectedSeats) {
      console.error("Tidak ada data booking, kembali ke halaman utama.");
      navigate('/');
    }
  }, [showtimeData, selectedSeats, navigate]);

  // 'Guard clause' untuk mencegah error render jika data belum ada
  if (!showtimeData || !selectedSeats) {
    return null;
  }
  
  const totalPrice = selectedSeats.length * showtimeData.price;
  const serviceFee = 3000 * selectedSeats.length;
  const finalPrice = totalPrice + serviceFee;

  const paymentOptions = [
    // Perbaikan 4: Path ke gambar di folder public
    { name: 'QRIS', icon: '/images/qris.svg' }, 
  ];

  const handleConfirm = async () => {
    setIsProcessing(true);
    const seatsToBook = selectedSeats.map(seatId => {
      const row = seatId.charAt(0);
      const number = parseInt(seatId.substring(1));
      return { row, number };
    });
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Anda harus login untuk melanjutkan.");
        navigate('/login');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/bookings', {
        showtimeId: showtimeData.id,
        seats: seatsToBook,
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const newBookingId = response.data.data.id;
      alert(`Pembelian tiket dengan ${paymentMethod} berhasil!`);

      // Perbaikan 2: Arahkan ke halaman detail transaksi yang baru dibuat
      navigate(`/my-tickets/${newBookingId}`);

    } catch (error) {
      alert('Pembelian tiket gagal: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-3">
        
        {/* Perbaikan 3: Kolom Kiri diisi dengan JSX yang benar */}
        <div className="md:col-span-2">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Detail Jadwal</h1>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500">Judul Film</p>
              <p className="text-xl font-bold text-gray-800">{showtimeData.movie.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal</p>
              <p className="text-xl font-bold text-gray-800">{format(new Date(showtimeData.startTime), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
            </div>
            <div className="flex gap-12">
              <div>
                <p className="text-sm text-gray-500">Kelas</p>
                <p className="text-xl font-bold text-gray-800">{showtimeData.auditorium.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jam</p>
                <p className="text-xl font-bold text-gray-800">{format(new Date(showtimeData.startTime), 'HH:mm')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tiket ({selectedSeats.length})</p>
              <p className="text-xl font-bold text-gray-800">{selectedSeats.join(', ')}</p>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="mt-8 flex items-center gap-2 font-bold text-gray-600 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            Kembali
          </button>
        </div>

        {/* Kolom Kanan: Ringkasan Order */}
        <div className="h-fit rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Ringkasan Order</h2>
          <div className="space-y-3 border-b pb-4">
            <p className="font-semibold">Detail Transaksi</p>
            <div className="flex justify-between text-gray-600">
              <span>REGULAR SEAT</span>
              <span>Rp. {showtimeData.price.toLocaleString('id-ID')} x{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>BIAYA LAYANAN</span>
              <span>Rp. 3.000 x{selectedSeats.length}</span>
            </div>
          </div>
          
          <div className="flex justify-between py-4 font-bold text-xl">
            <span>Total Bayar</span>
            <span>Rp. {finalPrice.toLocaleString('id-ID')}</span>
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold">Metode Pembayaran</p>
            {paymentOptions.map(option => (
              <PaymentOption 
                key={option.name}
                name={option.name}
                icon={option.icon}
                isSelected={paymentMethod === option.name}
                onClick={() => setPaymentMethod(option.name)}
              />
            ))}
          </div>

          <p className="mt-4 text-xs text-red-500">*Pembelian tiket tidak dapat dibatalkan</p>
          <button 
            onClick={handleConfirm}
            disabled={isProcessing}
            className="mt-4 w-full rounded-lg bg-blue-800 py-3 font-bold text-white transition-colors hover:bg-blue-900 disabled:bg-gray-400"
          >
            {isProcessing ? 'Memproses...' : `BAYAR DENGAN ${paymentMethod}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
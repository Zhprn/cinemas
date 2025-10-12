import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Komponen untuk satu kursi
function Seat({ status, seatId, onClick }) {
  const statusClasses = {
    available: 'bg-gray-200 hover:bg-gray-300 cursor-pointer',
    booked: 'bg-gray-700 cursor-not-allowed',
    disabled: 'bg-transparent cursor-not-allowed',
    selected: 'bg-blue-600 text-white cursor-pointer',
  };

  return (
    <div
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-semibold ${statusClasses[status]}`}
    >
      {status !== 'disabled' && seatId}
    </div>
  );
}


function SeatSelectionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showtimeId = searchParams.get('showtimeId');

  const [showtimeData, setShowtimeData] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil data detail jadwal tayang
  useEffect(() => {
    if (!showtimeId) {
      setError('ID Jadwal tayang tidak ditemukan.');
      setLoading(false);
      return;
    }

    const fetchShowtime = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/showtimes/${showtimeId}`);
        setShowtimeData(response.data);
      } catch (err) {
        setError('Gagal memuat data kursi.');
      } finally {
        setLoading(false);
      }
    };
    fetchShowtime();
  }, [showtimeId]);

  const handleSeatClick = (seatId, status) => {
    if (status === 'booked' || status === 'disabled') return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };
  
  const handleConfirmBooking = () => {
  // Cek apakah pengguna sudah memilih kursi
  if (selectedSeats.length === 0) {
    alert('Silakan pilih minimal satu kursi.');
    return;
  }

  // Arahkan ke halaman konfirmasi dan kirim data yang diperlukan
  navigate('/booking/confirmation', {
    state: {
      showtimeData,   // Data lengkap jadwal tayang
      selectedSeats,  // Array kursi yang dipilih (e.g., ['C8', 'C9'])
    },
  });
};

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  // Render Peta Kursi
  const renderSeats = () => {
    const { auditorium, bookedSeats } = showtimeData;
    const { rows, cols, disabledSeats = [] } = auditorium.seatLayout;
    const bookedSeatIds = bookedSeats.map(s => `${s.seatRow}${s.seatNumber}`);
    
    const seatGrid = [];
    for (let i = 0; i < rows; i++) {
      const rowChar = String.fromCharCode(65 + i);
      const rowSeats = [];
      for (let j = 1; j <= cols; j++) {
        const seatId = `${rowChar}${j}`;
        let status = 'available';
        if (disabledSeats.includes(seatId)) status = 'disabled';
        else if (bookedSeatIds.includes(seatId)) status = 'booked';
        else if (selectedSeats.includes(seatId)) status = 'selected';
        
        rowSeats.push(<Seat key={seatId} seatId={seatId} status={status} onClick={() => handleSeatClick(seatId, status)} />);
      }
      seatGrid.push(<div key={rowChar} className="flex items-center justify-center gap-2">{rowSeats}</div>);
    }
    return seatGrid;
  };
  
  const totalPrice = selectedSeats.length * (showtimeData?.price || 0);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold d-flex">PILIH KURSI</h1>
      <p className="text-gray-500">Pilih kursi yang akan kamu tempati selama pemutaran film</p>
      
      {/* Legenda */}
      <div className="my-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-gray-700"></div><span>Terisi</span></div>
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-gray-200"></div><span>Kosong</span></div>
        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-sm bg-blue-600"></div><span>Dipilih</span></div>
      </div>

      {/* Peta Kursi */}
      <div className="flex flex-col gap-2">{showtimeData && renderSeats()}</div>

      {/* Layar Bioskop */}
      <div className="my-8 w-med rounded-md bg-blue-500 py-2 text-center font-bold text-white">
        Layar Bioskop Disini
      </div>

      {/* Ringkasan & Konfirmasi */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_8px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-xl font-bold">Rp. {totalPrice.toLocaleString('id-ID')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kursi</p>
            <p className="font-bold">{selectedSeats.join(', ')}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(-1)} className="rounded-lg border border-gray-300 px-6 py-3 font-bold">Kembali</button>
            <button 
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0}
              className="rounded-lg bg-blue-800 px-6 py-3 font-bold text-white disabled:bg-gray-400"
            >
              KONFIRMASI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeatSelectionPage;
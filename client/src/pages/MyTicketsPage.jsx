import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

function TicketCard({ booking }) {
  const { showtime } = booking;
  if (!showtime) return null;

  return (
    <Link 
      to={`/my-tickets/${booking.id}`}
      // ClassName yang benar untuk styling kartu
      className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <img 
        src={showtime.movie.posterUrl} 
        alt={showtime.movie.title}
        className="h-32 w-24 rounded-md object-cover"
      />
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-gray-800">{showtime.movie.title}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {format(new Date(showtime.startTime), 'EEEE, dd MMMM yyyy, HH:mm', { locale: localeId })}
        </p>
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span>{showtime.auditorium.cinema.name} ({showtime.auditorium.name})</span>
        </div>
      </div>
    </Link>
  );
}


function MyTicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setBookings(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data tiket.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, [navigate]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Tiket Saya</h1>
        <p className="mt-2 text-gray-600">Daftar tiket dan transaksi yang pernah Anda lakukan.</p>

        <div className="mt-8 space-y-6">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <TicketCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm">
              <p>Anda belum memiliki tiket.</p>
              <Link to="/" className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white">
                Cari Film
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTicketsPage;
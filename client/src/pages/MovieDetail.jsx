import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

// Helper function untuk mengubah menit menjadi format "Xj Ym"
function formatDuration(minutes) {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}j ${remainingMinutes}m`;
}

// Komponen untuk tombol tanggal
function DateButton({ date, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-shrink-0 flex-col items-center rounded-lg px-4 py-2 text-sm transition-colors ${
        isSelected ? 'bg-blue-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      <span className="font-bold">{format(date, 'dd MMM', { locale: localeId })}</span>
      <span className="text-xs">{format(date, 'EEE', { locale: localeId }).toUpperCase()}</span>
    </button>
  );
}

function MovieDetailPage() {
  const { id: movieId } = useParams();
  const navigate = useNavigate();

  const [movieData, setMovieData] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Buat daftar tanggal untuk 5 hari ke depan
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // Efek untuk mengambil detail film & jadwal awal
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/movies/${movieId}`);
        setMovieData(response.data.movie);
        setSchedules(response.data.schedules);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetail();
  }, [movieId]);

  // Efek untuk mengambil ulang jadwal saat tanggal berubah
  useEffect(() => {
    const fetchSchedulesByDate = async () => {
      try {
        setLoading(true); // Tampilkan loading saat tanggal baru dipilih
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const response = await axios.get(`http://localhost:5000/api/showtimes?movieId=${movieId}&date=${dateString}`);
        setSchedules(response.data);
        setSelectedShowtime(null); // Reset pilihan jadwal saat tanggal berubah
      } catch (err) {
        console.error("Gagal memuat jadwal untuk tanggal lain:", err);
        setSchedules([]); // Kosongkan jadwal jika ada error
      } finally {
        setLoading(false);
      }
    };

    // Cek agar tidak fetch ulang saat pertama kali halaman load
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
    if (!isToday) {
      fetchSchedulesByDate();
    }
  }, [selectedDate, movieId]);

  const handleBuyTicket = () => {
    if (!selectedShowtime) {
      alert("Silakan pilih jadwal terlebih dahulu!");
      return;
    }
    // Arahkan ke halaman pemilihan kursi dengan membawa ID jadwal
    navigate(`/booking/seats?showtimeId=${selectedShowtime.id}`);
  };

  if (loading && !movieData) return <div className="p-10 text-center">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-gray-100">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-3">
        
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-800">JADWAL</h1>
          <p className="text-gray-500">Pilih jadwal bioskop yang akan kamu tonton</p>

          <div className="my-6 flex space-x-3 overflow-x-auto pb-2">
            {/* {dates.map((date, index) => (
              <DateButton 
                key={index}
                date={date}
                isSelected={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
                onClick={() => setSelectedDate(date)}
              />
            ))} */}
          </div>

          <div className="space-y-8">
            {loading ? <div className="text-center">Memuat jadwal...</div> :
             schedules.length > 0 ? schedules.map(({ cinema, showtimes }) => {
              const groupedByAuditoriumType = showtimes.reduce((acc, showtime) => {
                const type = showtime.auditoriumName.toUpperCase();
                if (!acc[type]) acc[type] = { price: showtime.price, times: [] };
                acc[type].times.push(showtime);
                return acc;
              }, {});

              return (
                <div key={cinema.id} className="rounded-lg bg-white p-4 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-800">{cinema.name}</h2>
                  <p className="text-sm text-gray-500">{cinema.address}</p>
                  
                  {Object.entries(groupedByAuditoriumType).map(([type, data]) => (
                    <div key={type} className="mt-4 border-t pt-4">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-bold text-gray-700">{type}</h3>
                        <p className="text-sm text-gray-600">Rp. {data.price.toLocaleString('id-ID')}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3">
                        {data.times.map((time) => (
                          <button
                            key={time.id}
                            onClick={() => setSelectedShowtime({ ...time, cinema })}
                            className={`rounded-md px-4 py-2 font-semibold transition-colors ${
                              selectedShowtime?.id === time.id
                                ? 'bg-blue-800 text-white'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                          >
                            {format(new Date(time.startTime), 'HH:mm')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }) : <p className="text-gray-500">Tidak ada jadwal untuk tanggal yang dipilih.</p>}
          </div>
        </div>

        {/* Kolom Kanan: Detail Film & Pilihan */}
        <div className="sticky top-24 h-fit">
          <img src={movieData?.posterUrl} alt={movieData?.title} className="w-full rounded-lg shadow-md" />
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{movieData?.title}</h1>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><span className="font-semibold">Genre:</span> {movieData?.genre}</p>
            <p><span className="font-semibold">Durasi:</span> {formatDuration(movieData?.durationMinutes)}</p>
            <p><span className="font-semibold">Rating Usia:</span> {movieData?.rating}</p>
          </div>

          {selectedShowtime && (
            <div className="mt-6 animate-fade-in rounded-lg border bg-white p-4">
              <h3 className="font-bold text-gray-800">{selectedShowtime.cinema.name}</h3>
              <p className="text-sm text-gray-600">{format(new Date(selectedShowtime.startTime), 'EEEE, dd MMMM yyyy', { locale: localeId })}</p>
              <div className="mt-2 flex items-center justify-between rounded-md bg-gray-100 p-2">
                <p className="text-sm font-semibold text-gray-700">{selectedShowtime.auditoriumName}</p>
                <p className="text-lg font-bold text-blue-800">{format(new Date(selectedShowtime.startTime), 'HH:mm')}</p>
              </div>
            </div>
          )}

          <button 
            onClick={handleBuyTicket}
            disabled={!selectedShowtime}
            className="mt-4 w-full rounded-lg bg-blue-800 py-3 font-bold text-white transition-colors hover:bg-blue-900 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            BELI SEKARANG
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailPage;
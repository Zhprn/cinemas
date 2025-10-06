import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Anda bisa memindahkan MovieCard ke file komponennya sendiri jika mau
function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="group flex flex-col gap-3 focus:outline-none">
      <div className="overflow-hidden rounded-xl shadow-lg shadow-black/20">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="aspect-[2/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-500">{movie.rating}</p>
      </div>
    </Link>
  );
}

function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState('all'); // Filter default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Buat URL berdasarkan filter yang aktif
        const url = filter === 'all'
          ? 'http://localhost:5000/api/movies'
          : `http://localhost:5000/api/movies?status=${filter}`;
        
        const response = await axios.get(url);
        setMovies(response.data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data film.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [filter]);

  const FilterButton = ({ status, children }) => (
    <button
      onClick={() => setFilter(status)}
      className={`rounded-full px-6 py-2 font-semibold transition-colors ${
        filter === status
          ? 'bg-blue-800 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {children}
    </button>
  );

  if (loading) return <div className="p-10 text-center">Loading movies...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Film</h1>

        {/* Tombol Filter */}
        <div className="my-6 flex flex-wrap gap-3">
          <FilterButton status="all">Semua Film</FilterButton>
          <FilterButton status="now_showing">Sedang Tayang</FilterButton>
          <FilterButton status="coming_soon">Akan Datang</FilterButton>
        </div>

        {/* Grid Film */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Tidak ada film untuk kategori ini.</p>
        )}
      </div>
    </div>
  );
}

export default MoviePage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroSlider from '../components/HeroSlider';

function HomePage() {
  // const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/movies');
        const allMovies = response.data;
        // const showing = allMovies.filter(movie => movie.isShowing === true);
        // setNowShowingMovies(showing);

        const sorted = [...allMovies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        setLatestMovies(sorted.slice(0, 5));

        setError(null);
      } catch (err) {
        setError('Gagal memuat data film. Pastikan server backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllMovies();
  }, []);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        <HeroSlider />
      </div>

      {/* Bagian Film Terbaru */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900">
          Film Terbaru
        </h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latestMovies.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="group flex flex-col gap-3 focus:outline-none"
              >
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
            ))}
          </div>
        )}
      </div>

      {/* Bagian Now Showing
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900">
          Now Showing
        </h1>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {nowShowingMovies.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="group flex flex-col gap-3 focus:outline-none"
              >
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
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
}

export default HomePage;
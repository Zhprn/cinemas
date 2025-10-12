import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsRegister(location.pathname === '/register');
  }, [location.pathname]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = {
      fullName: e.target.fullName?.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };
    
    const url = isRegister
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    try {
      if (isRegister) {
        await axios.post(url, formData);
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
      } else {
        const response = await axios.post(url, formData);
        // login(response.data.token); 
        localStorage.setItem('authToken', response.data.token);
        alert('Login berhasil!');
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Terjadi kesalahan.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      <div className="relative h-[600px] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Form Container */}
        <div className="absolute top-0 h-full w-1/2 left-0 p-12 flex items-center justify-center">
          <form onSubmit={handleAuthSubmit} className={`w-full transition-all duration-500 ease-in-out ${isRegister ? 'opacity-0' : 'opacity-100'}`}>
            <h1 className="text-3xl font-bold text-gray-800 text-center">Login</h1>
            <input name="email" type="email" placeholder="Email" required className="my-3 w-full rounded-md border bg-gray-100 p-3" />
            <input name="password" type="password" placeholder="Password" required className="my-3 w-full rounded-md border bg-gray-100 p-3" />
            {error && !isRegister && <p className="text-center text-sm text-red-600">{error}</p>}
            <div className="text-center">
                <button type="submit" disabled={loading} className="mt-4 w-48 rounded-full bg-blue-600 py-3 font-bold text-white transition-all active:scale-95 disabled:bg-gray-400">
                {loading && !isRegister ? 'Memproses...' : 'Login'}
                </button>
            </div>
          </form>
        </div>

        <div className="absolute top-0 h-full w-1/2 left-1/2 p-12 flex items-center justify-center">
          <form onSubmit={handleAuthSubmit} className={`w-full transition-all duration-500 ease-in-out ${isRegister ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-3xl font-bold text-gray-800 text-center">Register</h1>
            <input name="fullName" type="text" placeholder="Nama Lengkap" required className="my-3 w-full rounded-md border bg-gray-100 p-3" />
            <input name="email" type="email" placeholder="Email" required className="my-3 w-full rounded-md border bg-gray-100 p-3" />
            <input name="password" type="password" placeholder="Password" required minLength="6" className="my-3 w-full rounded-md border bg-gray-100 p-3" />
            {error && isRegister && <p className="text-center text-sm text-red-600">{error}</p>}
            <div className="text-center">
                <button type="submit" disabled={loading} className="mt-4 w-48 rounded-full bg-blue-600 py-3 font-bold text-white transition-all active:scale-95 disabled:bg-gray-400">
                {loading && isRegister ? 'Memproses...' : 'Register'}
                </button>
            </div>
          </form>
        </div>

        {/* Overlay Container */}
        <div className={`absolute top-0 h-full w-1/2 overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-700 ease-in-out ${isRegister ? 'left-0 rounded-r-2xl' : 'left-1/2 rounded-l-2xl'}`}>
          <div className="relative h-full w-full">
            <div className={`absolute flex h-full w-full transform flex-col items-center justify-center p-12 text-center text-white transition-all duration-700 ease-in-out ${isRegister ? 'translate-x-0' : '-translate-x-full'}`}>
              <h1 className="text-3xl font-bold">Selamat Datang!</h1>
              <p className="mt-4 text-sm">Sudah punya akun? Silakan masuk.</p>
              <button onClick={() => navigate('/login')} className="mt-8 rounded-full border border-white px-8 py-2 font-bold">
                Login
              </button>
            </div>
            <div className={`absolute flex h-full w-full transform flex-col items-center justify-center p-12 text-center text-white transition-all duration-700 ease-in-out ${isRegister ? 'translate-x-full' : 'translate-x-0'}`}>
              <h1 className="text-3xl font-bold">Hello, Welcome!</h1>
              <p className="mt-4 text-sm">Belum punya akun? Silakan daftar.</p>
              <button onClick={() => navigate('/register')} className="mt-8 rounded-full border border-white px-8 py-2 font-bold">
                Register
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AuthPage;
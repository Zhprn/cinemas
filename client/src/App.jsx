import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetail';
import SeatSelectionPage from './pages/SeatSelectionPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import MyTicketsPage from './pages/MyTicketsPage';
import TransactionDetailPage from './pages/TransactionDetailPage';
import MoviePage from './pages/MoviePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route 
          path="/booking/seats" 
          element={
            <ProtectedRoute>
              <SeatSelectionPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/booking/confirmation" 
          element={
            <ProtectedRoute>
              <ConfirmationPage />
            </ProtectedRoute>
          } 
        />
                <Route 
          path="/my-tickets" 
          element={
            <ProtectedRoute>
              <MyTicketsPage />
            </ProtectedRoute>
          } 
        />
                <Route 
          path="/my-tickets/:id" // <-- Tambahkan rute ini
          element={
            <ProtectedRoute>
              <TransactionDetailPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
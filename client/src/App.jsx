// File: src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // 1. Impor Navbar
import Footer from './components/Footer';

function HomePage() {
  return <div className="container mx-auto p-8">Ini Halaman Utama</div>
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
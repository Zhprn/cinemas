import { NavLink, Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-extrabold text-blue-800">
          TIX ID
        </Link>
        <div className="hidden items-center space-x-10 md:flex">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              isActive 
                ? 'font-bold text-blue-700' 
                : 'font-semibold text-gray-500 transition-colors hover:text-blue-700'
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/my-tickets"
            className={({ isActive }) => 
              isActive 
                ? 'font-bold text-blue-700' 
                : 'font-semibold text-gray-500 transition-colors hover:text-blue-700'
            }
          >
            Tiket Saya
          </NavLink>
          <NavLink 
            to="/movie"
            className={({ isActive }) => 
              isActive 
                ? 'font-bold text-blue-700' 
                : 'font-semibold text-gray-500 transition-colors hover:text-blue-700'
            }
          >
            Film
          </NavLink>
        </div>
        <div className="flex items-center space-x-5">
          <Link to="/profile">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 font-bold text-white ring-2 ring-amber-300 ring-offset-2">
              A
            </div>
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
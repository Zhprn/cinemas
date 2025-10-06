import { NavLink, Link } from 'react-router-dom';
function BellIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-6 w-6" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
      />
    </svg>
  );
}

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
          <button className="text-gray-500 transition-colors hover:text-gray-800">
            <BellIcon />
          </button>
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
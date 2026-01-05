import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar({ isLoggedIn, onLogout, userName, isAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const authPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-bg text-white shadow-lg border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold font-dmsans text-accent">🚗 PlateTrace</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3 font-dmsans text-sm">
                  <Link to="/dashboard" className="hover:text-accent transition font-semibold">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="hover:text-accent transition font-semibold">
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="hover:text-accent transition font-semibold">
                      Admin
                    </Link>
                  )}
                  <span className="text-xs text-gray-300 whitespace-nowrap">Welcome, {userName}!</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition font-bold text-xs"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              !authPage && (
                <>
                  <Link
                    to="/login"
                    className="bg-accent text-bg px-4 py-2 rounded hover:bg-accent-600 transition font-dmsans font-bold shadow-inner-light"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="border-2 border-accent text-accent hover:bg-accent hover:text-bg px-4 py-2 rounded transition font-dmsans font-bold"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block hover:text-accent py-2 transition font-dmsans"
                >
                  Dashboard
                </Link>
                <Link to="/profile" className="block hover:text-accent py-2 transition font-dmsans">
                  Profile
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="block hover:text-accent py-2 transition font-dmsans">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition font-dmsans text-sm font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              !authPage && (
                <>
                  <Link to="/login" className="block hover:text-accent py-2 transition font-dmsans">
                    Login
                  </Link>
                  <Link to="/register" className="block hover:text-accent py-2 transition font-dmsans">
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

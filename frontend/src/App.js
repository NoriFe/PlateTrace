import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUserRaw = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('is_admin');
    if (storedUserRaw) {
      try {
        const userData = JSON.parse(storedUserRaw);
        let name = 'User';
        if (userData.first_name && userData.last_name) {
          name = `${userData.first_name} ${userData.last_name}`;
        } else if (userData.email || userData.username) {
          name = userData.email || userData.username;
        }
        if (token || name) {
          setIsLoggedIn(true);
          setUserName(name);
          setIsAdmin(storedIsAdmin === 'true');
        }
      } catch (e) {
        // ignore malformed storage
      }
    }
  }, []);

  const handleLogin = (user) => {
    let name = 'User';
    if (user && user.first_name && user.last_name) {
      name = `${user.first_name} ${user.last_name}`;
    } else if (user && (user.email || user.username)) {
      name = user.email || user.username;
    }
    setIsLoggedIn(true);
    setUserName(name);
    setIsAdmin(!!user?.is_admin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setIsAdmin(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_admin');
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  // Admin-protected route wrapper
  const AdminRoute = ({ children }) => {
    return isLoggedIn && isAdmin ? children : <Navigate to="/dashboard" />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          onLogout={handleLogout} 
          userName={userName}
          isAdmin={isAdmin}
        />
        
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <RegisterPage onLogin={handleLogin} />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <UploadPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage userName={userName} />
                </ProtectedRoute>
              } 
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call your backend login API
      const response = await fetch('http://localhost:8000/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const userPayload = {
          email: data.email || email,
          username: data.username || email,
          first_name: data.first_name,
          last_name: data.last_name,
        };
        // Store user info and token
        localStorage.setItem('user', JSON.stringify(userPayload));
        localStorage.setItem('token', data.token || '');
        onLogin(userPayload);
        navigate('/dashboard');
      } else {
        let msg = 'Invalid email or password';
        try {
          const errBody = await response.json();
          msg = errBody.detail || errBody.message || msg;
        } catch (e) {
          // ignore
        }
        setError(msg);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4">
      <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-xl shadow-accent/20 p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-accent mb-8 font-dmsans">
          Login to PlateTrace
        </h2>

        {error && (
          <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-3 rounded mb-4 font-dmsans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-600 text-bg font-bold py-2 rounded-lg transition disabled:opacity-50 shadow-inner-light font-dmsans"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 font-dmsans">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:text-accent-600 font-bold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

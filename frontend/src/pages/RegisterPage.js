import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call your backend register API
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const userPayload = {
          email: data.email || formData.email,
          username: data.username || formData.email,
          first_name: data.first_name || formData.firstName,
          last_name: data.last_name || formData.lastName,
        };
        localStorage.setItem('user', JSON.stringify(userPayload));
        localStorage.setItem('token', data.token || '');
        onLogin(userPayload);
        navigate('/dashboard');
      } else {
        // Try to show backend error detail to help debugging
        let message = 'Registration failed. Please try again.';
        try {
          const errorBody = await response.json();
          message = errorBody.detail || errorBody.message || message;
          console.error('Register error response:', errorBody);
        } catch (parseErr) {
          console.error('Register error (non-JSON):', parseErr);
        }
        setError(message);
      }
    } catch (err) {
      console.error('Register network error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center py-12 px-4">
      <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-xl shadow-accent/20 p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-accent mb-8 font-dmsans">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-3 rounded mb-4 font-dmsans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-accent font-bold mb-2 font-dmsans">Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
                placeholder="Name"
              />
            </div>
            <div>
              <label className="block text-accent font-bold mb-2 font-dmsans">Surname</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
                placeholder="Surname"
              />
            </div>
          </div>

          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 font-dmsans">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-600 font-bold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

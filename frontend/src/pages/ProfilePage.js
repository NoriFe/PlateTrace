import { useState, useEffect } from 'react';

function ProfilePage({ userName }) {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load user profile from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setProfile({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      password: '',
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        first_name: profile.firstName,
        last_name: profile.lastName,
      };
      if (profile.password) {
        payload.password = profile.password;
      }

      const response = await fetch('http://localhost:8000/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setProfile((prev) => ({ ...prev, password: '' }));
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.first_name = profile.firstName;
        user.last_name = profile.lastName;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        const errBody = await response.json();
        setMessage(errBody.detail || errBody.message || 'Failed to update profile');
      }
    } catch (err) {
      setMessage('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-8">
        <h1 className="text-3xl font-bold text-accent mb-8 font-dmsans">Profile</h1>

        {/* Display current name */}
        <div className="bg-gray-800 border-2 border-accent/30 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-3 font-dmsans">Current Profile</h2>
          <div className="space-y-2">
            <p className="text-gray-300 font-dmsans">
              <span className="text-accent font-bold">Full Name:</span> {profile.firstName} {profile.lastName}
            </p>
            <p className="text-gray-300 font-dmsans">
              <span className="text-accent font-bold">Email:</span> {profile.email}
            </p>
          </div>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded mb-4 font-dmsans ${message.includes('success') ? 'bg-accent/20 text-accent border-2 border-accent' : 'bg-red-900 text-red-200 border border-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 font-dmsans">Update Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-accent font-bold mb-2 font-dmsans">Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              />
            </div>
            <div>
              <label className="block text-accent font-bold mb-2 font-dmsans">Surname</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              />
            </div>
          </div>

          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 bg-gray-700 border-2 border-accent/30 text-gray-400 rounded-lg font-dmsans"
            />
          </div>

          <div>
            <label className="block text-accent font-bold mb-2 font-dmsans">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 shadow-inner-light font-dmsans"
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
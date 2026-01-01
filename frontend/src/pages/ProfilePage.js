import { useState, useEffect } from 'react';

function ProfilePage({ userName }) {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load user profile from localStorage or API
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setProfile({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setEditing(false);
        // Update localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.first_name = profile.firstName;
        user.last_name = profile.lastName;
        user.phone = profile.phone;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        setMessage('Failed to update profile');
      }
    } catch (err) {
      setMessage('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-8">
        <h1 className="text-3xl font-bold text-accent mb-8 font-dmsans">Profile</h1>

        {message && (
          <div className={`px-4 py-3 rounded mb-4 font-dmsans ${message.includes('success') ? 'bg-accent/20 text-accent border-2 border-accent' : 'bg-red-900 text-red-200 border border-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-accent font-bold mb-2 font-dmsans">First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-700 disabled:text-gray-400 font-dmsans"
              />
            </div>
            <div>
              <label className="block text-accent font-bold mb-2 font-dmsans">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-700 disabled:text-gray-400 font-dmsans"
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
            <label className="block text-accent font-bold mb-2 font-dmsans">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-4 py-2 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent disabled:bg-gray-700 disabled:text-gray-400 font-dmsans"
            />
          </div>

          <div className="flex gap-4">
            {!editing ? (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 px-6 rounded-lg transition shadow-inner-light font-dmsans"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 px-6 rounded-lg transition disabled:opacity-50 shadow-inner-light font-dmsans"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-2 px-6 rounded-lg transition font-dmsans"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;

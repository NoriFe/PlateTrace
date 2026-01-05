import { useEffect, useState } from 'react';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const adminUserId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8000/users?admin_user_id=${adminUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Failed to fetch users');
      }
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/users/admin/${userId}?admin_user_id=${adminUserId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Delete failed');
      }
      setUsers((prev) => prev.filter((u) => u.user_id !== userId));
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const toggleAdmin = async (userId, nextValue) => {
    try {
      const res = await fetch(
        `http://localhost:8000/users/admin/${userId}?admin_user_id=${adminUserId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ is_admin: nextValue }),
        }
      );
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || 'Update failed');
      }
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.user_id === userId ? updated : u)));
    } catch (err) {
      setError(err.message || 'Update failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-accent mb-6 font-dmsans">Admin Panel</h1>
      {error && (
        <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-3 rounded mb-4 font-dmsans">
          {error}
        </div>
      )}
      <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-accent/30">
          <h2 className="text-xl text-white font-dmsans">Users</h2>
          <button
            onClick={fetchUsers}
            className="text-sm bg-accent text-bg px-3 py-1 rounded font-dmsans hover:bg-accent-600"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <table className="w-full">
          <thead className="bg-gray-800 border-b-2 border-accent/30">
            <tr>
              <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">ID</th>
              <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Email</th>
              <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Username</th>
              <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Admin</th>
              <th className="text-right px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {users.map((user) => (
              <tr key={user.user_id} className="hover:bg-gray-800 transition">
                <td className="px-6 py-4 text-gray-200 font-dmsans text-sm">{user.user_id}</td>
                <td className="px-6 py-4 text-gray-200 font-dmsans text-sm">{user.email}</td>
                <td className="px-6 py-4 text-gray-200 font-dmsans text-sm">{user.username}</td>
                <td className="px-6 py-4 text-gray-200 font-dmsans text-sm">{user.is_admin ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button
                    onClick={() => toggleAdmin(user.user_id, !user.is_admin)}
                    className="text-sm px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-dmsans"
                  >
                    {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button
                    onClick={() => deleteUser(user.user_id)}
                    className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-dmsans"
                    disabled={user.is_admin}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="px-6 py-4 text-gray-400 font-dmsans" colSpan={5}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;

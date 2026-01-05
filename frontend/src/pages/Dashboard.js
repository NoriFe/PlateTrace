import { useState, useEffect } from 'react';
import ConnectionTest from '../components/ConnectionTest';

function Dashboard() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    platesTracked: 0,
    vehicles: 0,
    detectionsToday: 0
  });
  const [recentPlates, setRecentPlates] = useState([]);

  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;

      // Fetch plates tracked
      const platesRes = await fetch(`http://localhost:8000/users/${userId}/plates`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const platesData = await platesRes.json();
      const platesTracked = platesData.count || 0;
      
      // Store recent plates (last 10)
      setRecentPlates(platesData.plates ? platesData.plates.slice(0, 10) : []);

      // Fetch vehicles
      const vehiclesRes = await fetch(`http://localhost:8000/users/${userId}/vehicles`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const vehiclesData = await vehiclesRes.json();
      const vehicles = vehiclesData.count || 0;

      // Fetch detections today
      const today = new Date().toISOString().split('T')[0];
      const detectionsRes = await fetch(`http://localhost:8000/users/${userId}/plates?date=${today}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const detectionsData = await detectionsRes.json();
      const detectionsToday = detectionsData.count || 0;

      setStats({
        platesTracked,
        vehicles,
        detectionsToday
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`http://localhost:8000/upload?user_id=${userId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setFile(null);
        // Refresh stats after successful upload
        await fetchStats();
      } else {
        const errBody = await response.json();
        setError(errBody.detail || 'Failed to process image');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (plateId) => {
    if (!plateId) return;
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`http://localhost:8000/users/${userId}/plates/${plateId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        // Optimistically update UI by filtering out the deleted item
        setRecentPlates(prev => prev.filter(plate => plate.read_id !== plateId));
        
        // Update stats count
        setStats(prev => ({
          ...prev,
          platesTracked: Math.max(0, prev.platesTracked - 1)
        }));
      }
    } catch (err) {
      console.error('Failed to delete plate read', err);
    }
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
    setResult(null);
    setError('');
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-7">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-accent mb-3 font-dmsans">Welcome to PlateTrace</h1>
        <p className="text-gray-300 text-lg max-w-2xl font-dmsans">
          Detect and track vehicle license plates instantly. Upload an image, get accurate plate detection, and manage your vehicle data in real-time.
        </p>
      </div>

      {/* Upload Button */}
      <div className="mb-8">
        <button onClick={handleUploadClick} className="bg-accent hover:bg-accent-600 text-bg font-bold py-3 px-6 rounded-lg transition shadow-inner-light font-dmsans text-lg">
          📸 Upload Image
        </button>
      </div>

      {/* Recent Detections */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4 font-dmsans">Your Activity</h2>
        {recentPlates.length > 0 ? (
          <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 overflow-x-auto">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b-2 border-accent/30">
                  <tr>
                    <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Plate</th>
                    <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Owner</th>
                    <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Vehicle</th>
                    <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Location</th>
                    <th className="text-left px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Timestamp</th>
                    <th className="text-right px-6 py-3 text-accent font-bold font-dmsans text-sm uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentPlates.map((plate) => (
                    <tr key={plate.read_id || `${plate.plate_number}-${plate.timestamp}`}
                        className="hover:bg-gray-800 transition">
                      <td className="px-6 py-4 text-white font-bold font-dmsans text-lg">{plate.plate_number}</td>
                      <td className="px-6 py-4 text-gray-300 font-dmsans">{plate.owner ? plate.owner.name : '-'}</td>
                      <td className="px-6 py-4 text-gray-300 font-dmsans">
                        {plate.vehicle ? `${plate.vehicle.make} ${plate.vehicle.model} (${plate.vehicle.color || ''})` : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-dmsans">
                        {plate.location ? plate.location.name || plate.location_id : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-dmsans text-sm">
                        {plate.timestamp ? new Date(plate.timestamp).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(plate.read_id)}
                          disabled={!plate.read_id}
                          className="text-red-400 hover:text-red-300 font-bold font-dmsans disabled:opacity-40 text-2xl"
                          aria-label="Delete entry"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {recentPlates.map((plate) => (
                <div
                  key={plate.read_id || `${plate.plate_number}-${plate.timestamp}`}
                  className="bg-gray-800 border border-accent/30 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-400 font-dmsans uppercase">Plate</p>
                      <p className="text-white font-bold font-dmsans text-lg">{plate.plate_number}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(plate.read_id)}
                      disabled={!plate.read_id}
                      className="text-red-400 hover:text-red-300 font-bold font-dmsans disabled:opacity-40 text-2xl"
                      aria-label="Delete entry"
                    >
                      ×
                    </button>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-dmsans uppercase">Owner</p>
                    <p className="text-gray-300 font-dmsans">{plate.owner ? plate.owner.name : '-'}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-dmsans uppercase">Vehicle</p>
                    <p className="text-gray-300 font-dmsans text-sm">
                      {plate.vehicle ? `${plate.vehicle.make} ${plate.vehicle.model} (${plate.vehicle.color || ''})` : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-dmsans uppercase">Location</p>
                    <p className="text-gray-300 font-dmsans">
                      {plate.location ? plate.location.name || plate.location_id : '-'}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 font-dmsans uppercase">Timestamp</p>
                    <p className="text-gray-300 font-dmsans text-xs">
                      {plate.timestamp ? new Date(plate.timestamp).toLocaleString() : '-'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-8 text-center">
            <p className="text-gray-400 font-dmsans text-lg">No detections yet. Upload an image to get started!</p>
          </div>
        )}
      </div>

      {/* Connection Test */}
      <div className="mt-8">
        <ConnectionTest />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border-2 border-accent rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-accent text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold text-accent mb-6 font-dmsans">Upload License Plate</h2>

            {/* Upload Form */}
            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-accent font-bold mb-3 font-dmsans">Select Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-accent/30 text-white rounded-lg focus:outline-none focus:border-accent font-dmsans"
                />
                <p className="text-gray-400 text-sm mt-2 font-dmsans">JPG, PNG or other image formats</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-3 rounded font-dmsans">
                  {error}
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="bg-gray-800 border-2 border-accent/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-accent mb-4 font-dmsans">Detection Result</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-sm font-dmsans mb-1">Filename</p>
                      <p className="text-white font-bold font-dmsans">{result.filename}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-dmsans mb-1">Detected Plate</p>
                      <p className="text-accent font-bold text-2xl font-dmsans">
                        {result.plate || 'No plate detected'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="flex-1 bg-accent hover:bg-accent-600 text-bg font-bold py-3 rounded-lg transition disabled:opacity-50 shadow-inner-light font-dmsans text-lg"
                >
                  {loading ? 'Processing...' : '📸 Upload & Detect'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-3 rounded-lg transition font-dmsans"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

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

      {/* Stats Section */}
      <h2 className="text-2xl font-bold text-white mb-4 font-dmsans">Your Activity</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {/* Stats Card 1 */}
        <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-3.5 hover:border-accent transition">
          <h3 className="text-accent text-[11px] font-bold mb-1 font-dmsans uppercase tracking-wide">Plates Tracked</h3>
          <p className="text-[26px] font-bold text-white font-dmsans">{stats.platesTracked}</p>
        </div>

        {/* Stats Card 2 */}
        <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-3.5 hover:border-accent transition">
          <h3 className="text-accent text-[11px] font-bold mb-1 font-dmsans uppercase tracking-wide">Vehicles</h3>
          <p className="text-[26px] font-bold text-white font-dmsans">{stats.vehicles}</p>
        </div>

        {/* Stats Card 3 */}
        <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-3.5 hover:border-accent transition">
          <h3 className="text-accent text-[11px] font-bold mb-1 font-dmsans uppercase tracking-wide">Detections Today</h3>
          <p className="text-[26px] font-bold text-white font-dmsans">{stats.detectionsToday}</p>
        </div>
      </div>

      {/* Connection Test */}
      <div className="mt-8">
        <ConnectionTest />
      </div>

      {/* Quick Actions */}
      <div className="mt-7">
        <h2 className="text-xl font-bold text-accent mb-4 font-dmsans">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={handleUploadClick} className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 rounded-lg transition shadow-inner-light font-dmsans text-sm">
            📸 Upload Image
          </button>
          <button className="border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-2 rounded-lg transition font-dmsans text-sm">
            🚗 Add Vehicle
          </button>
        </div>
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

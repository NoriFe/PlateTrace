import { useState } from 'react';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-bg px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-accent mb-8 font-dmsans">Upload License Plate</h1>

        {/* Upload Form */}
        <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-8 mb-8">
          <form onSubmit={handleUpload} className="space-y-6">
            {/* File Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-accent hover:bg-accent-600 text-bg font-bold py-3 rounded-lg transition disabled:opacity-50 shadow-inner-light font-dmsans text-lg"
            >
              {loading ? 'Processing...' : '📸 Upload & Detect'}
            </button>
          </form>
        </div>

        {/* Result */}
        {result && (
          <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-8">
            <h2 className="text-2xl font-bold text-accent mb-6 font-dmsans">Detection Result</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm font-dmsans mb-1">Filename</p>
                <p className="text-white font-bold text-lg font-dmsans">{result.filename}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm font-dmsans mb-1">Detected Plate</p>
                <p className="text-accent font-bold text-3xl font-dmsans px-4 py-3 bg-gray-800 border-2 border-accent/30 rounded-lg">
                  {result.plate}
                </p>
              </div>

              <button
                onClick={() => {
                  setResult(null);
                  setFile(null);
                }}
                className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-2 rounded-lg transition font-dmsans mt-4"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadPage;

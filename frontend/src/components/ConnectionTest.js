import { useState } from 'react';
import { api } from '../services/api';

function ConnectionTest() {
  const [status, setStatus] = useState('Not tested');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await api.testConnection();
      setStatus('✅ Connected!');
      setData(response);
    } catch (error) {
      setStatus('❌ Connection failed');
      setData(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-accent font-dmsans">Backend Connection Test</h2>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-accent hover:bg-accent-600 text-bg font-bold py-1 px-3 rounded disabled:opacity-50 shadow-inner-light font-dmsans text-xs"
        >
          {loading ? 'Testing...' : 'Test'}
        </button>
      </div>

      <div className="mt-1">
        <p className="text-sm font-dmsans">
          Status: <span className={status.includes('✅') ? 'text-accent font-bold' : 'text-red-500'}>
            {status}
          </span>
        </p>
        {data && (
          <div className="mt-2 p-3 bg-gray-800 border border-accent/30 rounded">
            <pre className="text-xs text-accent font-dmsans">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectionTest;

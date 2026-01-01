import ConnectionTest from '../components/ConnectionTest';

function Dashboard() {
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
          <p className="text-[26px] font-bold text-white font-dmsans">0</p>
        </div>

        {/* Stats Card 2 */}
        <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-3.5 hover:border-accent transition">
          <h3 className="text-accent text-[11px] font-bold mb-1 font-dmsans uppercase tracking-wide">Vehicles</h3>
          <p className="text-[26px] font-bold text-white font-dmsans">0</p>
        </div>

        {/* Stats Card 3 */}
        <div className="bg-gray-900 border-2 border-accent/50 rounded-lg shadow-lg shadow-accent/20 p-3.5 hover:border-accent transition">
          <h3 className="text-accent text-[11px] font-bold mb-1 font-dmsans uppercase tracking-wide">Detections Today</h3>
          <p className="text-[26px] font-bold text-white font-dmsans">0</p>
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
          <button className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 rounded-lg transition shadow-inner-light font-dmsans text-sm">
            📸 Upload Image
          </button>
          <button className="border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-2 rounded-lg transition font-dmsans text-sm">
            🚗 Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

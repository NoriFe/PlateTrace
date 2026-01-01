import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <img src={logo} className="h-24 mx-auto mb-6 animate-spin" alt="logo" />
          <h1 className="text-5xl font-bold text-gray-800 mb-4">PlateTrace</h1>
          <p className="text-xl text-gray-600 mb-8">
            ✅ Tailwind CSS is working perfectly!
          </p>
          <div className="space-y-4">
            <p className="text-gray-700">
              Edit <code className="bg-gray-200 px-2 py-1 rounded">src/App.js</code> and save to see changes.
            </p>
            <a
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-105"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

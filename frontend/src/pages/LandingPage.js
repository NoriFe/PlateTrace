import { Link } from 'react-router-dom';

function LandingPage({ isLoggedIn }) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6 font-dmsans">
            🚗 Welcome to <span className="text-accent">PlateTrace</span>
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-dmsans">
            Track and identify vehicles instantly. Simple, fast, secure.
          </p>
          <div className="flex justify-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 px-6 rounded-lg transition transform hover:scale-105 shadow-inner-light font-dmsans"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-2 px-6 rounded-lg transition font-dmsans"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-accent hover:bg-accent-600 text-bg font-bold py-2 px-6 rounded-lg transition transform hover:scale-105 shadow-inner-light font-dmsans"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-bg font-bold py-2 px-6 rounded-lg transition font-dmsans"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-bg py-20 border-t border-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-white mb-16 font-dmsans">
            Why <span className="text-accent">PlateTrace</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-bg border border-accent/30 p-8 rounded-lg shadow-lg hover:shadow-accent/20 transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-accent mb-3 font-dmsans">
                Accurate Detection
              </h3>
              <p className="text-gray-400 font-dmsans">
                Get precise plate readings every time with our detection system.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-bg border border-accent/30 p-8 rounded-lg shadow-lg hover:shadow-accent/20 transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-accent mb-3 font-dmsans">
                Real-Time Tracking
              </h3>
              <p className="text-gray-400 font-dmsans">
                Monitor vehicles as they move. See everything in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-bg border border-accent/30 p-8 rounded-lg shadow-lg hover:shadow-accent/20 transition">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-accent mb-3 font-dmsans">
                Secure & Private
              </h3>
              <p className="text-gray-400 font-dmsans">
                Your data stays protected. We take security seriously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only show when NOT logged in */}
      {!isLoggedIn && (
        <section className="bg-bg py-16 border-t border-accent/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-6 text-accent font-dmsans">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-gray-300 font-dmsans">
              Start tracking vehicles today. No credit card required.
            </p>
            <Link
              to="/register"
              className="bg-accent text-bg hover:bg-accent-600 font-bold py-2 px-6 rounded-lg transition transform hover:scale-105 inline-block shadow-inner-light font-dmsans"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      )}

      {/* About Section - Explain the project */}
      <section className="bg-bg py-20 border-t border-accent/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-accent font-dmsans">About PlateTrace</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 font-dmsans">What is PlateTrace?</h3>
              <p className="text-gray-300 text-lg font-dmsans">
                PlateTrace is a vehicle license plate detection and tracking system. It uses AI-powered image recognition to detect license plates from images, automatically extract the plate text, and help you manage vehicle data in a centralized dashboard.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-3 font-dmsans">How to Use</h3>
              <ul className="text-gray-300 text-lg space-y-2 font-dmsans list-disc list-inside">
                <li><span className="text-accent font-bold">Upload Image:</span> Go to Dashboard and click "📸 Upload Image" to submit a vehicle photo</li>
                <li><span className="text-accent font-bold">Detection:</span> The system detects and reads the license plate automatically</li>
                <li><span className="text-accent font-bold">Track Vehicles:</span> Add vehicles to your list and monitor their activity</li>
                <li><span className="text-accent font-bold">View Stats:</span> Check your dashboard for tracking statistics and history</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-3 font-dmsans">Tech Stack</h3>
              <p className="text-gray-300 text-lg font-dmsans">
                <span className="text-accent font-bold">Frontend:</span> React 19, Tailwind CSS, React Router
                <br />
                <span className="text-accent font-bold">Backend:</span> FastAPI (Python)
                <br />
                <span className="text-accent font-bold">Detection:</span> Advanced OCR/ML for plate recognition
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

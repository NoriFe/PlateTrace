import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-bg text-white mt-16 border-t border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent font-dmsans">🚗 PlateTrace</h3>
            <p className="text-gray-400 text-sm font-dmsans">
              Track and manage vehicle plates with advanced detection technology.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-accent font-dmsans">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-dmsans">
              <li>
                <Link to="/" className="hover:text-accent transition">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-accent font-dmsans">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-dmsans">
              <li>
                <Link to="/" className="hover:text-accent transition">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-accent transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-accent font-dmsans">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400 font-dmsans">
              <li>
                <button className="hover:text-accent transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="hover:text-accent transition">
                  Terms of Service
                </button>
              </li>
              <li>
                <button className="hover:text-accent transition">
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent/20 mt-8 pt-8">
          <div className="flex justify-between items-center text-sm text-gray-400 font-dmsans">
            <p>&copy; 2026 PlateTrace. All rights reserved.</p>
            <div className="flex space-x-6">
              <button className="hover:text-accent transition">
                Twitter
              </button>
              <button className="hover:text-accent transition">
                GitHub
              </button>
              <button className="hover:text-accent transition">
                LinkedIn
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

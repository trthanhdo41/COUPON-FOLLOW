import { Link, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav className="bg-[#364454] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="flex items-center">
              <span className="bg-primary text-white px-3 py-1.5 font-bold text-base tracking-tight">
                COUPON
              </span>
              <span className="text-primary font-bold text-base ml-0.5 tracking-tight">
                FOLLOW
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            <Link 
              to="/coupons" 
              className="text-white hover:text-gray-200 transition-colors font-medium text-[15px]"
            >
              Coupons
            </Link>
            <Link 
              to="/stores" 
              className="text-white hover:text-gray-200 transition-colors font-medium text-[15px]"
            >
              Stores
            </Link>
            <Link 
              to="/cashback" 
              className="text-white hover:text-gray-200 transition-colors font-medium text-[15px]"
            >
              Cashback
            </Link>
            <Link 
              to="/saving-guides" 
              className="text-white hover:text-gray-200 transition-colors font-medium text-[15px]"
            >
              Saving Guides
            </Link>
          </div>

              {/* Search Bar */}
              <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative w-full">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search for a store"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                  />
                </form>
              </div>

          {/* Sign In / Join Buttons */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Link 
              to="/signin"
              className="text-white hover:text-gray-200 transition-colors font-medium text-[15px] hidden sm:block"
            >
              Sign In
            </Link>
            <Link 
              to="/join"
              className="bg-primary hover:bg-[#00b8a0] text-white px-6 py-2.5 rounded-md font-semibold transition-all text-sm shadow-sm hover:shadow-md"
            >
              Join
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#2c3e50] pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/coupons" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Coupons</Link>
            <Link to="/stores" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Stores</Link>
            <Link to="/cashback" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Cashback</Link>
            <Link to="/saving-guides" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Saving Guides</Link>
                <form onSubmit={handleSearch} className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="Search for a store"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-4 py-2 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </form>
            <Link to="/signin" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Sign In</Link>
            <Link to="/join" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Join</Link>
            <Link to="/admin/login" className="block px-3 py-2 text-base font-medium text-white hover:bg-primary">Admin Login</Link>
          </div>
        </div>
      )}
    </nav>
  );
}


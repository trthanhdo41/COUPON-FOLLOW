import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo & Country Selector */}
          <div>
            <Link to="/" className="flex items-center mb-6">
              <span className="bg-primary text-white px-3 py-1.5 rounded-sm font-bold text-base tracking-tight">
                COUPON
              </span>
              <span className="text-primary font-bold text-base ml-0.5 tracking-tight">
                FOLLOW
              </span>
            </Link>
            
            <div className="flex items-center gap-2 text-sm">
              <span>Change country:</span>
              <button className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="text-xl">🌐</span>
                <span className="text-xl">🇺🇸</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Site Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Site Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/ccpa" className="hover:text-white transition-colors">CCPA Privacy Notice</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* Info & Tools */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Info & Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/research" className="hover:text-white transition-colors">Research & Data</Link></li>
              <li><Link to="/press" className="hover:text-white transition-colors">Press & Media Kit</Link></li>
              <li><a href="https://cently.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Cently</a></li>
              <li><a href="https://smilematic.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Smilematic</a></li>
              <li><Link to="/guidelines" className="hover:text-white transition-colors">Editorial Guidelines</Link></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/support" className="hover:text-white transition-colors">Support & Feedback</Link></li>
              <li>
                <a href="https://twitter.com/couponfollow" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <FaTwitter /> X
                </a>
              </li>
              <li>
                <a href="https://facebook.com/couponfollow" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <FaFacebook /> Facebook
                </a>
              </li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About</h3>
            <p className="text-sm leading-relaxed mb-4">
              CouponFollow tracks coupon codes from online merchants to help consumers save money. We may earn a commission when you use one of our coupons/links to make a purchase. You should check any coupon or promo code of interest on the merchant website to ensure validity before making a purchase.
            </p>
            <Link to="/accessibility-tools" className="text-primary hover:underline text-sm font-medium">
              Open Accessibility Tools
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; 2025 NextGen Shopping LLC, A System1 Company</p>
        </div>
      </div>
    </footer>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

export default function Join() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!consent) {
      setError('Please agree to the Terms of Use and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Failed to create account. Please try again.');
      }
      console.error('Join error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white shadow-2xl flex overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark items-center justify-center p-12">
          <div className="text-center">
            <div className="text-9xl mb-6">😎</div>
            <h2 className="text-3xl font-bold text-white mb-4">Join CouponFollow</h2>
            <p className="text-white text-lg mb-2">Earn cashback and get exclusive codes!</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Join CouponFollow</h1>
            <p className="text-gray-600 mb-8">
              Earn <span className="text-primary font-semibold">cashback</span> and get{' '}
              <span className="text-primary font-semibold">exclusive</span> codes!
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {/* Social Sign Up Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all">
                <FaGoogle className="text-xl text-red-500" />
                <span className="text-primary font-bold">JOIN WITH GOOGLE</span>
              </button>
              
              <button className="w-full bg-[#E8F0FE] hover:bg-[#D6E4FA] text-[#1877F2] font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all">
                <FaFacebook className="text-xl" />
                <span className="font-bold">JOIN WITH FACEBOOK</span>
              </button>
              
              <button className="w-full bg-[#2c3e50] hover:bg-[#1a252f] text-white font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all">
                <FaApple className="text-xl" />
                <span className="font-bold">JOIN WITH APPLE</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Email Sign Up Form */}
            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sign up with email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 characters)"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 mr-3 w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
                <label htmlFor="consent" className="text-sm text-gray-600">
                  I consent to receiving savings tips and offers via email
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00b8d4] hover:bg-[#00a0c0] text-white font-bold py-3 px-4 transition-all disabled:opacity-50"
              >
                {loading ? 'CREATING ACCOUNT...' : 'JOIN'}
              </button>

              <div className="text-xs text-gray-500 text-center">
                By signing up I agree to CouponFollow's{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Use
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
                <br />
                <br />
                Please note that Cashback is only available for US residents.{' '}
                <Link to="/cashback-info" className="text-primary hover:underline">
                  Learn More
                </Link>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary hover:underline font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


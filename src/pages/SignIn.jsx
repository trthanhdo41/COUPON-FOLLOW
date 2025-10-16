import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error('Sign in error:', error);
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
            <div className="text-9xl mb-6">😊</div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome Back!</h2>
            <p className="text-white text-lg">Sign in to access exclusive deals and cashback offers</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">Sign In to your</h1>
            <h2 className="text-3xl font-bold text-[#2c3e50] mb-8">CouponFollow account</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6">
                {error}
              </div>
            )}

            {/* Social Sign In Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all">
                <FaGoogle className="text-xl text-red-500" />
                <span className="text-primary font-bold">SIGN IN WITH GOOGLE</span>
              </button>
              
              <button className="w-full bg-[#E8F0FE] hover:bg-[#D6E4FA] text-[#1877F2] font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all">
                <FaFacebook className="text-xl" />
                <span className="font-bold">SIGN IN WITH FACEBOOK</span>
              </button>
              
              <button className="w-full bg-[#2c3e50] hover:bg-[#1a252f] text-white font-semibold py-3 px-4 flex items-center justify-center gap-3 transition-all">
                <FaApple className="text-xl" />
                <span className="font-bold">SIGN IN WITH APPLE</span>
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

            {/* Email Sign In Form */}
            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter email
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00b8d4] hover:bg-[#00a0c0] text-white font-bold py-3 px-4 transition-all disabled:opacity-50"
              >
                {loading ? 'SIGNING IN...' : 'SIGN IN WITH EMAIL'}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/join" className="text-primary hover:underline font-semibold">
                  Join here
                </Link>
              </p>
              <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-primary mt-4 inline-block">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


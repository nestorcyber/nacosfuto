import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ScrollToTopLink from '../components/ScrollToTopLink';
import Navbar from '../components/Nav/Navbar'

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/auth/forgot-password`,
        { email },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || 'Request failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-100">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h2>
            <p className="text-gray-600 dark:text-white mb-6">
              Enter your email to receive a reset link
            </p>

            {message ? (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                {message}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                    University Email*
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}

            <div className="mt-4 text-center text-sm text-gray-600 dark:text-white">
              Remember your password?{' '}
              <ScrollToTopLink to="/login" className="text-green-600 hover:underline">
                Login here
              </ScrollToTopLink>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
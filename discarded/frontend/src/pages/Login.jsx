import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Nav/Navbar';
import ScrollToTopLink from '../components/ScrollToTopLink';

axios.defaults.withCredentials = true;

export default function Login() {
  const { user, isLoggedIn, login, dummyLoginAsStaff, dummyLogout } = useAuth();
  const navigate = useNavigate();

   useEffect(() => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto'; // force-enable scroll
    }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(user.isStaff ? '/staff-dashboard' : '/dashboard', { replace: true });
    }
  }, [isLoggedIn, user, navigate]);


  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    userType: 'student', // 'student' or 'staff'
    isCourseRep: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const credentials = {
        identifier: formData.identifier,
        password: formData.password,
        userType: formData.userType,
        isCourseRep: formData.isCourseRep
      };
  
      const loginSuccess = await login(credentials);
      if (loginSuccess) {
        navigate(formData.userType === 'student' ? '/dashboard' : '/staff-dashboard');
      } else {
        setError('Invalid credentials or account not verified');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login error occurred');
    } finally {
      setIsLoading(false);
    }
  };  

  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
              {formData.userType === 'student' ? 'Student Login' : 'Staff Login'}
            </h2>

            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, userType: 'student', isCourseRep: false})}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                    formData.userType === 'student' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, userType: 'staff'})}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                    formData.userType === 'staff' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Staff
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {formData.userType === 'student' 
                    ? 'Email or Registration Number*' 
                    : 'Email or Staff ID*'}
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder={
                    formData.userType === 'student' 
                      ? 'example@futo.edu.ng or 20123456789' 
                      : 'example@futo.edu.ng or STAFF123'
                  }
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white pr-10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              {formData.userType === 'staff' && (
                <div className="flex items-center">
                  <input
                    id="is-course-rep"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                    checked={formData.isCourseRep}
                    onChange={(e) => setFormData({...formData, isCourseRep: e.target.checked})}
                  />
                  <label htmlFor="is-course-rep" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I'm a Course Representative
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition duration-200 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
        
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : 'Login'}
              </button>

              <button
                onClick={dummyLoginAsStaff}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Dummy Staff Login (Test Only)
              </button>
              <button
                onClick={dummyLogout}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Dummy Logout (Test Only)
              </button>

<div className="border-t pt-4 border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?{' '}
              <ScrollToTopLink
                to="/signup" 
                className="text-green-600 hover:underline font-medium dark:text-green-400"
              >
                Signup here
              </ScrollToTopLink>
            </p>

            <ScrollToTopLink 
              to="/forgot-password" 
              className="text-green-600 hover:underline text-sm mt-2 block dark:text-green-400"
            >
              Forgot password?
            </ScrollToTopLink>
          </div>                    
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
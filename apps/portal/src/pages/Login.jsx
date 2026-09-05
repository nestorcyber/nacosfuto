import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCloudinaryAssetUrl } from '@nacos/media';
import { signInStudent } from '@nacos/supabase/auth';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { FaUserShield } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Registration / Matric Number.');
      return;
    }
    if (!password) {
      setError('Please enter your Password.');
      return;
    }
    setIsLoading(true);
    setError('');

    const res = await signInStudent(identifier.trim(), password);
    setIsLoading(false);
    if (res.error) {
      setError(res.error.message || 'Login failed.');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    const regNo = role === 'President' ? '20201112948' : '20241029481';
    const res = await signInStudent(regNo, 'password');
    setIsLoading(false);
    if (!res.error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* LEFT HALF (50%): Real Department Photo with Logo, Clean Overlay & Bold Text */}
      <div 
        className="md:w-1/2 min-h-[360px] md:min-h-screen relative flex flex-col justify-between p-8 sm:p-12 md:p-14 lg:p-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${getCloudinaryAssetUrl('gallery_student_group') || studentPhoto})` }}
      >
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 pointer-events-none"></div>

        {/* Top Left NACOS Brand Logo */}
        <div className="relative z-10">
          <img src={getCloudinaryAssetUrl('full-logo-dark') || logoDark} alt="NACOS FUTO Logo" className="h-9 sm:h-11 w-auto object-contain drop-shadow" />
        </div>

        {/* Text bottom left */}
        <div className="relative z-10 max-w-lg space-y-2 mt-auto pt-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug tracking-tight">
            Your NACOS account unlocks a world of computing excellence
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 font-normal">
            Department of Computer Science • Federal University of Technology, Owerri
          </p>
        </div>
      </div>

      {/* RIGHT HALF (50%): Minimalist, Clean White Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Heading & Sign up link */}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
              Sign in or create your account below
            </h1>
            <p className="mt-2 text-xs text-gray-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#138601] font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Student Email Instruction Notice */}
          <div className="p-3 rounded bg-[#ebf3ff]/70 border border-[#cbe1ff] text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Notice:</span> When signing up, please use the <strong>exact same email address</strong> you used on the FUTO portal when you joined FUTO.
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded bg-red-50 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Clean Input Form Box */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <input
                type="text"
                required
                placeholder="Registration number (digits only, e.g. 20241029481)"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end text-xs">
              <Link 
                to="/forgot-password" 
                className="text-[#138601] font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-7 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center"
            >
              {isLoading ? 'Signing in...' : 'Continue'}
            </button>
          </form>

          {/* Horizontal Line with Clean Text */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-gray-300"></div>
            <span className="bg-white px-3 text-xs text-gray-600 font-medium whitespace-nowrap">
              Or continue with
            </span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          {/* Quick Action Buttons - Only Login as Admin */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('President')}
              className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-900 bg-[#f1f3f5] hover:bg-[#e9ecef] rounded transition-colors cursor-pointer"
            >
              <div className="w-6 flex items-center justify-center text-gray-900 mr-2">
                <FaUserShield className="w-4 h-4" />
              </div>
              <span className="flex-1 text-center font-medium">Login as Admin</span>
            </button>
          </div>

          {/* Minimal Footnote Link to Main Website */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500">
            <a 
              href="http://localhost:5173" 
              className="hover:text-black transition-colors"
            >
              Main Website →
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;

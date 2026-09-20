import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCloudinaryAssetUrl } from '@nacos/media';
import { signInStudent, isLocalEnvironment } from '@nacos/supabase/auth';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { FaUserShield } from 'react-icons/fa';
import { AlertCircle, Eye, EyeOff, RotateCw, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Registration / Matric Number or Email.');
      return;
    }
    if (!password) {
      setError('Please enter your Password.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const res = await signInStudent(identifier.trim(), password);
      if (res.error) {
        setError(res.error.message || 'Invalid credentials. Please verify your details.');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('A network or server error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setIsLoading(true);
    setError('');
    const regNo = role === 'President' ? '20201012948' : '20241429481';
    try {
      const res = await signInStudent(regNo, 'password');
      if (!res.error) {
        navigate('/dashboard');
      } else {
        setError(res.error.message || 'Demo login failed.');
      }
    } catch (err) {
      setError('Could not complete demo login.');
    } finally {
      setIsLoading(false);
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
          <p className="text-sm sm:text-base text-gray-200 font-normal">
            Department of Computer Science • Federal University of Technology, Owerri
          </p>
        </div>
      </div>

      {/* RIGHT HALF (50%): Minimalist, Clean White Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Heading & Sign up link */}
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
              Sign in to your student account
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-[#138601] font-semibold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>

          {/* Error Message with Context Actions */}
          {error && (
            <div className="p-3.5 rounded bg-red-50 border border-red-200 text-xs sm:text-sm text-red-700 font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="leading-relaxed flex-1">
                <p>{error}</p>
                {error.toLowerCase().includes('create an account') && (
                  <div className="mt-2 pt-2 border-t border-red-200/80">
                    <Link to="/register" className="inline-flex items-center gap-1 font-bold text-[#138601] hover:underline">
                      <span>Go to Student Registration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
                {error.toLowerCase().includes('incorrect password') && (
                  <div className="mt-2 pt-2 border-t border-red-200/80">
                    <Link to="/forgot-password" className="inline-flex items-center gap-1 font-bold text-[#138601] hover:underline">
                      <span>Reset your forgotten password</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clean Input Form Box */}
          <form onSubmit={handleContinue} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Registration Number or Email
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 20241450682 or name@futo.edu.ng"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 text-sm sm:text-base rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3 text-sm sm:text-base rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end text-sm">
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
              className="w-full px-7 py-3 min-h-[44px] text-sm sm:text-base font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </form>

          {/* Development Quick Login - Only shown on localhost */}
          {isLocalEnvironment() && (
            <>
              <div className="relative flex items-center justify-center py-2">
                <div className="w-full border-t border-gray-300"></div>
                <span className="bg-white px-3 text-xs text-amber-600 font-medium whitespace-nowrap">
                  Dev Mode: Localhost Only
                </span>
                <div className="w-full border-t border-gray-300"></div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('President')}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer border border-gray-200"
                >
                  <div className="w-6 flex items-center justify-center text-gray-700 mr-2">
                    <FaUserShield className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-center font-medium">Quick Demo Login (Admin)</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
};

export default Login;

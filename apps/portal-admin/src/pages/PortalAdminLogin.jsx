import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getCloudinaryAssetUrl } from '@nacos/media';
import { loginPortalAdmin, getPortalAdminSession, isLocalEnvironment } from '@nacos/auth';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';

export const PortalAdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect
  useEffect(() => {
    const existing = getPortalAdminSession();
    if (existing) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your administrative email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await loginPortalAdmin(email.trim(), password);
      setIsLoading(false);

      if (res?.error) {
        setError(res.error);
      } else {
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred during administrative authentication.');
    }
  };

  const handleQuickLogin = (adminEmail) => {
    setEmail(adminEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* LEFT HALF (50%): Department Photo with Brand Logo, Clean Overlay & Portal Admin Text */}
      <div 
        className="md:w-1/2 min-h-[360px] md:min-h-screen relative flex flex-col justify-between p-8 sm:p-12 md:p-14 lg:p-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${getCloudinaryAssetUrl('gallery_student_group') || studentPhoto})` }}
      >
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 pointer-events-none"></div>

        {/* Top Left NACOS Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img 
            src={getCloudinaryAssetUrl('full-logo-dark') || logoDark} 
            alt="NACOS FUTO Logo" 
            className="h-9 sm:h-11 w-auto object-contain drop-shadow" 
          />
          <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-[#138601]/90 text-white border border-green-500/30">
            Portal Admin
          </span>
        </div>

        {/* Text bottom left */}
        <div className="relative z-10 max-w-lg space-y-2 mt-auto pt-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug tracking-tight">
            Student Portal Administration & Verification
          </h2>
          <p className="text-sm sm:text-base text-gray-200 font-normal">
            Department of Computer Science • Federal University of Technology, Owerri
          </p>
        </div>
      </div>

      {/* RIGHT HALF (50%): Minimalist, Clean White Form Matching Portal UI */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Heading */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-[#138601] border border-green-200 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Access Control</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 tracking-tight">
              Sign in to Portal Control
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Authorized access for student registry and ID card verification officers.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded bg-red-50 text-sm text-red-600 font-medium flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Clean Input Form Box */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="portaladmin@nacos.org.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-7 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as Portal Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Chip (Localhost / Development Only) */}
          {isLocalEnvironment() && (
            <div className="pt-4 border-t border-gray-100">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Quick Test Credentials (Localhost Only)
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('portaladmin@nacos.org.ng')}
                  className="px-3 py-1.5 text-xs font-medium bg-[#ebf3ff] hover:bg-[#d8e8ff] text-blue-800 rounded transition-colors cursor-pointer"
                >
                  Portal Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('superadmin@nacos.org.ng')}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-[#138601] rounded transition-colors cursor-pointer"
                >
                  Super Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalAdminLogin;

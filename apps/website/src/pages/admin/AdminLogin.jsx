import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  RefreshCw, 
  Globe, 
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { loginWebsiteAdmin, getWebsiteAdminSession } from '@nacos/supabase/adminAuth';
import logoLight from '../../assets/full-logo-light.png';
import logoDark from '../../assets/full-logo-dark.png';
import { useTheme } from '../../context/ThemeContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [demoHint, setDemoHint] = useState(true);

  // If already logged in with valid website admin scope, redirect to /admin
  useEffect(() => {
    const existing = getWebsiteAdminSession();
    if (existing) {
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await loginWebsiteAdmin(email, password);
      setLoading(false);

      if (res.error) {
        setErrorMessage(res.error);
      } else {
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred during administrative login.');
    }
  };

  const fillCredentials = (userEmail) => {
    setEmail(userEmail);
    setPassword('password');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between selection:bg-[#138601] selection:text-white relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#083002_0%,transparent_50%),radial-gradient(circle_at_80%_80%,#041801_0%,transparent_50%)] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logoDark} alt="NACOS FUTO Logo" className="h-9 w-auto object-contain" />
          <div className="border-l border-green-800/40 pl-3">
            <span className="text-xs font-bold text-[#4bd043] tracking-wide uppercase block">
              Website CMS
            </span>
            <span className="text-[11px] text-green-200/60 block">
              Main Website Scope
            </span>
          </div>
        </Link>

        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-green-200/80 hover:text-white transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-[#4bd043]" /> Back to Public Website
        </a>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full space-y-6">
          
          {/* Card Container */}
          <div className="bg-[#083002]/90 backdrop-blur-xl border border-[#138601]/40 rounded-3xl p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#138601]/20 border border-[#138601]/50 text-[#4bd043] flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Website Administration
              </h1>
              <p className="text-xs text-green-100/70 leading-relaxed max-w-xs mx-auto">
                Authorized management console for NACOS public content, Cloudinary media, and departmental announcements.
              </p>
            </div>

            {/* Scope Notice Badge */}
            <div className="p-3 rounded-xl bg-black/40 border border-[#138601]/30 text-[11px] text-green-200/80 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-[#4bd043] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-white block">Dedicated Administration Scope</span>
                <p className="text-green-200/70 text-[10.5px]">
                  Student portal credentials and unprivileged accounts are strictly prohibited from this interface.
                </p>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-red-100 block">Authorization Refused</span>
                  <p>{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-green-100 font-semibold">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-green-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. webadmin@nacos.org.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-black/50 border border-[#138601]/40 text-white placeholder-green-100/30 focus:outline-none focus:border-[#4bd043] focus:ring-1 focus:ring-[#4bd043] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-green-100 font-semibold">
                    Master Password
                  </label>
                  <span className="text-[10px] text-green-300/60">Encrypted session</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-green-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 rounded-xl bg-black/50 border border-[#138601]/40 text-white placeholder-green-100/30 focus:outline-none focus:border-[#4bd043] focus:ring-1 focus:ring-[#4bd043] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#138601] to-[#0f6c01] hover:from-[#117601] hover:to-[#0d5901] shadow-lg shadow-green-950/50 border border-[#4bd043]/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials & Scope...</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate to Website Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Scoped Quick Selector / Demo Helper */}
            {demoHint && (
              <div className="pt-4 border-t border-[#138601]/20 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-green-200/70 font-semibold">
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#4bd043]" /> Test Accounts (Scope Verification)
                  </span>
                  <button
                    type="button"
                    onClick={() => setDemoHint(false)}
                    className="text-[10px] text-green-400 hover:underline"
                  >
                    Hide
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => fillCredentials('webadmin@nacos.org.ng')}
                    className="p-2 rounded-lg bg-black/40 border border-[#138601]/30 hover:border-[#4bd043] text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Web Admin</span>
                    <span className="text-green-300/80 block truncate">webadmin@nacos.org.ng</span>
                    <span className="text-[9px] text-[#4bd043] block mt-0.5">Scope: main_website (Granted)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials('editor@nacos.org.ng')}
                    className="p-2 rounded-lg bg-black/40 border border-[#138601]/30 hover:border-[#4bd043] text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Content Editor</span>
                    <span className="text-green-300/80 block truncate">editor@nacos.org.ng</span>
                    <span className="text-[9px] text-[#4bd043] block mt-0.5">Scope: main_website (Granted)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials('superadmin@nacos.org.ng')}
                    className="p-2 rounded-lg bg-black/40 border border-[#138601]/30 hover:border-[#4bd043] text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-white block">Super Admin</span>
                    <span className="text-green-300/80 block truncate">superadmin@nacos.org.ng</span>
                    <span className="text-[9px] text-yellow-300 block mt-0.5">Scope: super_admin (Universal)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillCredentials('portaladmin@nacos.org.ng')}
                    className="p-2 rounded-lg bg-red-950/20 border border-red-800/40 hover:border-red-600 text-left transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-red-200 block">Portal Only Admin</span>
                    <span className="text-red-300/70 block truncate">portaladmin@nacos.org.ng</span>
                    <span className="text-[9px] text-red-400 block mt-0.5">Scope: student_portal (Will Deny)</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          <p className="text-center text-[11px] text-green-200/50">
            NACOS FUTO Department of Computer Science • Web Administration Module v2.0
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[10px] text-green-200/40">
        Secure SHA-256 Authentication • Scoped Supabase Roles • Cloudinary Media Integration
      </footer>
    </div>
  );
};

export default AdminLogin;

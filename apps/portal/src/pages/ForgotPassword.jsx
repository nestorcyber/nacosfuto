import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSent(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* LEFT HALF (50%): Real Department Photo with Logo, Clean Overlay & Bold Text */}
      <div 
        className="md:w-1/2 min-h-[360px] md:min-h-screen relative flex flex-col justify-between p-8 sm:p-12 md:p-14 lg:p-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${studentPhoto})` }}
      >
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25 pointer-events-none"></div>

        {/* Top Left NACOS Brand Logo */}
        <div className="relative z-10">
          <img src={logoDark} alt="NACOS FUTO Logo" className="h-9 sm:h-11 w-auto object-contain drop-shadow" />
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

      {/* RIGHT HALF (50%): Minimalist, Clean White Form Matching Login UI */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          {/* Form Heading & Back Link */}
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
              Reset your password
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              Enter your student email address to receive password recovery instructions.
            </p>
          </div>

          {/* Student Email Instruction Notice */}
          <div className="p-3 rounded bg-[#ebf3ff]/70 border border-[#cbe1ff] text-xs text-gray-700 leading-relaxed">
            <span className="font-semibold text-gray-900">Notice:</span> Please enter the <strong>exact same email address</strong> you used on the FUTO portal when you joined FUTO.
          </div>

          {isSent ? (
            <div className="space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 text-[#138601] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Reset link sent</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-[#138601]">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#138601] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Student email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full px-7 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center"
              >
                Send Reset Link
              </button>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                </Link>
              </div>
            </form>
          )}

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

export default ForgotPassword;

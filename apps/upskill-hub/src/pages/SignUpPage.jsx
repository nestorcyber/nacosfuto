import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Check
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/authService';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNacosStudent, setIsNacosStudent] = useState(false);
  const [regNo, setRegNo] = useState('');
  const [track, setTrack] = useState('Web Development');

  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingReg, setIsVerifyingReg] = useState(false);
  const [regVerificationMessage, setRegVerificationMessage] = useState(null);
  const [alreadyHasNacosAccount, setAlreadyHasNacosAccount] = useState(false);
  const [error, setError] = useState('');

  // Live verification when reg number is blurred or changed
  const handleVerifyReg = async (val) => {
    if (!val || val.trim().length < 4) return;
    setIsVerifyingReg(true);
    setRegVerificationMessage(null);
    setAlreadyHasNacosAccount(false);

    try {
      const res = await authService.verifyNacosRegNumber(val.trim());
      if (res.exists) {
        if (res.hasAccount) {
          setAlreadyHasNacosAccount(true);
          setRegVerificationMessage({
            type: 'warning',
            text: `Reg number verified! You already have an active NACOS account for ${val}. Please sign in directly!`,
          });
        } else {
          setRegVerificationMessage({
            type: 'success',
            text: `Verified NACOS Student (${res.student?.level || 'Computing Scholar'}). We will link your student profile!`,
          });
          if (res.student?.full_name && !fullName) {
            setFullName(res.student.full_name);
          }
          if (res.student?.email && !email) {
            setEmail(res.student.email);
          }
        }
      } else {
        setRegVerificationMessage({
          type: 'error',
          text: `Registration number "${val}" not found in the NACOS departmental registry. You can still register as an open learner.`,
        });
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsVerifyingReg(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (isNacosStudent && !regNo.trim()) {
      setError('Please enter your NACOS Student Registration / Matric Number.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        fullName,
        email,
        password,
        isNacosStudent,
        regNo,
        track,
      });

      if (result.success) {
        navigate('/my-learning');
      } else {
        setError(result.error || 'Registration failed.');
        if (result.alreadyHasNacosAccount) {
          setAlreadyHasNacosAccount(true);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041801] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        
        {/* Brand Icon */}
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-[#138601] flex items-center justify-center text-white shadow-xl group-hover:scale-105 transition-transform">
            <GraduationCap className="w-7 h-7" />
          </div>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Create Your <span className="text-[#4bd043]">Upskill Account</span>
        </h2>
        
        <p className="text-xs sm:text-sm text-green-100/70">
          Join hundreds of scholars building world-class software skills.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#083002] py-8 px-6 sm:px-10 border border-[#138601]/30 rounded-2xl shadow-2xl space-y-6">
          
          {/* Error / Account Exists Notice */}
          {error && (
            <div className="p-4 rounded-xl text-xs flex items-start gap-2.5 border bg-red-950/40 border-red-500/40 text-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{error}</p>
                {alreadyHasNacosAccount && (
                  <div className="pt-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#138601] text-white text-xs font-bold hover:bg-[#0f6c01] transition-colors"
                    >
                      <span>Sign In with Your NACOS Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ─── EXACT USER REQUIREMENT: NACOS STUDENT CHECKMARK ─── */}
            <div className="p-4 rounded-xl bg-[#041801] border-2 border-[#138601]/40 hover:border-[#138601] transition-colors">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isNacosStudent}
                  onChange={(e) => {
                    setIsNacosStudent(e.target.checked);
                    setRegVerificationMessage(null);
                    setAlreadyHasNacosAccount(false);
                  }}
                  className="mt-1 w-4 h-4 rounded text-[#138601] focus:ring-[#138601] bg-[#083002] border-[#138601]/50 cursor-pointer"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>I am a NACOS Student</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#138601]/30 text-[#4bd043] border border-[#138601]/40 font-mono">
                      FUTO Verified
                    </span>
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Check this if you are an enrolled Computer Science / SICT student to link your departmental profile.
                  </p>
                </div>
              </label>

              {/* Conditional Registration / Matric Number Prompt */}
              {isNacosStudent && (
                <div className="mt-3 pt-3 border-t border-[#138601]/20 space-y-2 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-[#4bd043] uppercase tracking-wider">
                    Registration / Matric Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      onBlur={(e) => handleVerifyReg(e.target.value)}
                      placeholder="e.g. 2021123456 or 2022/..."
                      required={isNacosStudent}
                      className="w-full px-3.5 py-2.5 bg-[#083002] border border-[#138601]/50 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#138601]"
                    />
                    {isVerifyingReg && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        Checking NACOS database...
                      </span>
                    )}
                  </div>

                  {/* Verification Feedback Badge */}
                  {regVerificationMessage && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                      regVerificationMessage.type === 'success'
                        ? 'bg-green-950/40 text-green-300 border border-green-800/40'
                        : regVerificationMessage.type === 'warning'
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                        : 'bg-red-950/40 text-red-300 border border-red-800/40'
                    }`}>
                      {regVerificationMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#4bd043] shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{regVerificationMessage.text}</span>
                    </div>
                  )}

                  {alreadyHasNacosAccount && (
                    <div className="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2">
                      <p className="text-xs text-amber-200">
                        You already have an existing NACOS student account! You don't need to sign up again.
                      </p>
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#138601] hover:bg-[#0f6c01] text-white text-xs font-bold transition-colors"
                      >
                        <span>Sign In Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Chukwuemeka Eze"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#041801] border border-[#138601]/40 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#138601]"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. scholar@students.nacosfuto.org"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#041801] border border-[#138601]/40 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#138601]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#041801] border border-[#138601]/40 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#138601]"
                />
              </div>
            </div>

            {/* Preferred Tech Track */}
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Primary Learning Track
              </label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#041801] border border-[#138601]/40 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
              >
                <option value="Web Development">Fullstack Web Development (React / Node.js)</option>
                <option value="Artificial Intelligence">Artificial Intelligence & Python Data Science</option>
                <option value="Cyber Security">Cyber Security & Ethical Hacking</option>
                <option value="Cloud Computing">Cloud Computing & DevOps</option>
                <option value="Mobile App">Mobile App Development (React Native / Flutter)</option>
                <option value="UI/UX Design">UI/UX & Product Design</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading || alreadyHasNacosAccount}
              className="w-full py-3 px-4 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-xs sm:text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Create Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-[#138601]/20 text-center text-xs text-gray-400">
            Already have an account or NACOS student credentials?{' '}
            <Link to="/login" className="font-bold text-[#4bd043] hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;

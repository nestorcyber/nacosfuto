import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCloudinaryAssetUrl } from '@nacos/media';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  RotateCw, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import { 
  lookupVerifiedStudentRecord, 
  sendStudentVerificationCode, 
  verifyStudentRegistrationCode, 
  completeVerifiedStudentRegistration 
} from '@nacos/supabase';
import { parseAdmissionYear, calculateCurrentLevel, calculateExpectedGraduation, CURRENT_ACADEMIC_YEAR_START } from '@nacos/config/academic';

const Register = () => {
  const navigate = useNavigate();
  // Step 1: Matric Lookup, Step 2: Details Confirmation & OTP, Step 3: Password Creation
  const [step, setStep] = useState(1);

  // Form states
  const [matricNumber, setMatricNumber] = useState('');
  const [verifiedRecord, setVerifiedRecord] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [devTestCode, setDevTestCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI status states
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Real-time automatic admission year & academic level preview
  const detectedAcademic = useMemo(() => {
    if (!matricNumber || matricNumber.trim().length < 4) {
      return null;
    }
    const parse = parseAdmissionYear(matricNumber, CURRENT_ACADEMIC_YEAR_START);
    if (!parse.valid) {
      return { valid: false, error: parse.error };
    }
    const admissionYear = parse.admissionYear;
    const levelInfo = calculateCurrentLevel(admissionYear, CURRENT_ACADEMIC_YEAR_START, 5);
    const expectedGraduation = calculateExpectedGraduation(admissionYear, 5);

    return {
      valid: true,
      admissionYear,
      levelString: levelInfo.levelString,
      expectedGraduation
    };
  }, [matricNumber]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // =========================================================================
  // STEP 1: Verify Registration Number against Verified Roster
  // =========================================================================
  const handleVerifyRegistrationNumber = async (e) => {
    e.preventDefault();
    setError('');

    const cleanMatric = matricNumber.trim();
    if (!cleanMatric) {
      setError('Please enter your registration number.');
      return;
    }

    if (detectedAcademic && !detectedAcademic.valid) {
      setError(detectedAcademic.error);
      return;
    }

    setIsLookingUp(true);
    try {
      const lookup = await lookupVerifiedStudentRecord(cleanMatric);
      if (!lookup.found) {
        setError(lookup.error?.message || 'Registration number not found in verified roster.');
        setIsLookingUp(false);
        return;
      }

      setVerifiedRecord(lookup.data);
      if (lookup.data.phone_number) {
        setPhone(lookup.data.phone_number);
      }

      // Dispatch 6-digit verification code to stored email
      const dispatch = await sendStudentVerificationCode(cleanMatric);
      if (dispatch.success) {
        setDevTestCode(dispatch.code || '');
        setResendCooldown(60);
        setStep(2);
      } else {
        setError(dispatch.error?.message || 'Failed to dispatch verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during verification lookup. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  // =========================================================================
  // STEP 2: Resend Verification Code
  // =========================================================================
  const handleResendCode = async () => {
    if (resendCooldown > 0 || !matricNumber) return;
    setError('');
    const dispatch = await sendStudentVerificationCode(matricNumber.trim());
    if (dispatch.success) {
      setDevTestCode(dispatch.code || '');
      setResendCooldown(60);
    } else {
      setError(dispatch.error?.message || 'Failed to resend code.');
    }
  };

  // =========================================================================
  // STEP 2: Validate 6-digit OTP Code
  // =========================================================================
  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!verificationCode.trim() || verificationCode.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }

    setIsVerifyingCode(true);
    try {
      const verifyRes = await verifyStudentRegistrationCode(matricNumber.trim(), verificationCode.trim());
      if (!verifyRes.success) {
        setError(verifyRes.error?.message || 'Invalid or expired verification code.');
        setIsVerifyingCode(false);
        return;
      }

      // Code valid -> Proceed to Step 3 (Set Password)
      setStep(3);
    } catch (err) {
      setError('Code verification failed. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // =========================================================================
  // STEP 3: Complete Registration & Create Account
  // =========================================================================
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please create an account password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must confirm that you agree to the NACOS FUTO constitution and student guidelines.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await completeVerifiedStudentRegistration(
        matricNumber.trim(),
        verificationCode.trim(),
        password,
        phone
      );

      if (res.error) {
        setError(res.error.message || 'Registration failed. Please contact administrator.');
        setIsSubmitting(false);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1600);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
      
      {/* LEFT HALF (50%): Authentic Department Group Photo & Portal Branding */}
      <div 
        className="md:w-1/2 min-h-[360px] md:min-h-screen relative flex flex-col justify-between p-8 sm:p-12 md:p-14 lg:p-16 bg-cover bg-center"
        style={{ backgroundImage: `url(${getCloudinaryAssetUrl('gallery_student_group') || studentPhoto})` }}
      >
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 pointer-events-none"></div>

        {/* Top Left NACOS Brand Logo */}
        <div className="relative z-10">
          <img 
            src={getCloudinaryAssetUrl('full-logo-dark') || logoDark} 
            alt="NACOS FUTO Logo" 
            className="h-9 sm:h-11 w-auto object-contain drop-shadow" 
          />
        </div>

        {/* Controlled Registration Info Notice */}
        <div className="relative z-10 max-w-lg space-y-3 mt-auto pt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4bd043]" />
            <span>Official Student Onboarding</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug tracking-tight">
            Verified Departmental Roster Authentication
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 font-normal leading-relaxed">
            Portal registration is strictly controlled and pre-authorized against the official Computer Science student database.
          </p>
        </div>
      </div>

      {/* RIGHT HALF (50%): Controlled 3-Step Verification & Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto">
          
          {/* Header & Step Indicator */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#138601]">
                Step {step} of 3
              </span>
              <span className="text-xs text-gray-500">
                {step === 1 && 'Matric Lookup'}
                {step === 2 && 'Email Confirmation & Code'}
                {step === 3 && 'Account Password'}
              </span>
            </div>

            {/* Step Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-[#138601] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              {step === 1 && 'Verify Registration Number'}
              {step === 2 && 'Confirm Identity & Verification Code'}
              {step === 3 && 'Create Account Password'}
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#138601] font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Success Screen */}
          {isSuccess ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-100 text-[#138601] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Registration Complete!</h2>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Welcome to NACOS FUTO, <strong>{verifiedRecord?.full_name}</strong>. Redirecting you to your student dashboard...
              </p>
            </div>
          ) : (
            <div>

              {/* ========================================================
                  STEP 1: REGISTRATION NUMBER LOOKUP
                  ======================================================== */}
              {step === 1 && (
                <form onSubmit={handleVerifyRegistrationNumber} className="space-y-4">
                  <div className="p-3.5 rounded bg-[#ebf3ff]/70 border border-[#cbe1ff] text-xs text-gray-700 leading-relaxed space-y-1">
                    <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#138601]" />
                      <span>Roster-Controlled Registration</span>
                    </div>
                    <p>
                      Enter your official FUTO Registration Number (digits only, e.g. <code>20241029481</code>). The portal will query the verified database to confirm your admission status.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      FUTO Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="e.g. 20241029481"
                      value={matricNumber}
                      onChange={(e) => setMatricNumber(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-mono font-medium transition-all"
                    />
                  </div>

                  {/* Real-time Academic Level & Admission Year Preview */}
                  {detectedAcademic && (
                    <div className={`p-3 rounded border text-xs transition-all ${
                      detectedAcademic.valid 
                        ? 'bg-green-50/80 border-green-200 text-green-900' 
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      {detectedAcademic.valid ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Detected Admission Year:</span>
                            <span className="font-bold text-[#138601]">{detectedAcademic.admissionYear}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Academic Level:</span>
                            <span className="font-bold text-[#138601]">{detectedAcademic.levelString}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Expected Graduation:</span>
                            <span className="font-bold text-gray-700">{detectedAcademic.expectedGraduation}</span>
                          </div>
                        </div>
                      ) : (
                        <p>{detectedAcademic.error}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLookingUp}
                      className="w-full px-7 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {isLookingUp ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Verifying with Database...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Registration Number</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================
                  STEP 2: CONFIRM IDENTITY & ENTER VERIFICATION CODE
                  ======================================================== */}
              {step === 2 && verifiedRecord && (
                <form onSubmit={handleConfirmCode} className="space-y-4">
                  {/* Verified Student Information Card */}
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 text-[#138601] flex items-center justify-center">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Verified Student Record
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                        {verifiedRecord.level}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className="text-gray-500 block text-[11px]">Full Student Name:</span>
                        <strong className="text-gray-900 text-sm">{verifiedRecord.full_name}</strong>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div>
                          <span className="text-gray-500 block">Registration Number:</span>
                          <span className="font-mono font-bold text-gray-800">{verifiedRecord.registration_number}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Session:</span>
                          <span className="font-semibold text-gray-800">{verifiedRecord.academic_session}</span>
                        </div>
                      </div>

                      <div className="text-[11px] pt-1">
                        <span className="text-gray-500 block">Department & Faculty:</span>
                        <span className="font-medium text-gray-800">{verifiedRecord.department} • {verifiedRecord.faculty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Email Notice (Uneditable) */}
                  <div className="p-3 rounded bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                    <Mail className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                    <div className="leading-relaxed">
                      We sent a 6-digit verification code to your official registered email: <strong className="font-mono">{verifiedRecord.masked_email}</strong>. (This email is pulled from university records and cannot be altered).
                    </div>
                  </div>

                  {/* Development Mode Helper Banner */}
                  {devTestCode && (
                    <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Development Test Code: <strong className="font-mono font-bold tracking-wider">{devTestCode}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerificationCode(devTestCode)}
                        className="text-[11px] text-emerald-700 underline font-semibold hover:text-emerald-900"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  {/* 6-Digit Code Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Enter 6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      placeholder="e.g. 123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 text-base text-center tracking-widest font-mono font-bold rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                    />
                  </div>

                  {/* Resend Code Link */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                    <span>Didn't receive the code?</span>
                    <button
                      type="button"
                      disabled={resendCooldown > 0}
                      onClick={handleResendCode}
                      className="text-[#138601] font-semibold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError('');
                      }}
                      className="px-4 py-2.5 min-h-[42px] text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingCode || verificationCode.trim().length !== 6}
                      className="flex-1 px-6 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isVerifyingCode ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Verifying Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify & Proceed</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================
                  STEP 3: CREATE PASSWORD & COMPLETE ONBOARDING
                  ======================================================== */}
              {step === 3 && verifiedRecord && (
                <form onSubmit={handleCompleteRegistration} className="space-y-4">
                  <div className="p-3 rounded bg-green-50 border border-green-200 text-xs text-green-900">
                    Identity verified for <strong>{verifiedRecord.full_name}</strong>. Create a secure password to finalize your student portal account.
                  </div>

                  {/* Optional phone number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Contact Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 08012345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Create Portal Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  {/* Confirmation Terms Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      required
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-[#138601] border-gray-300 rounded focus:ring-[#138601] cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-600 select-none cursor-pointer leading-relaxed">
                      I confirm that I am a registered student in good standing with NACOS FUTO and agree to the portal terms.
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 min-h-[42px] text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin" />
                          <span>Activating Account...</span>
                        </>
                      ) : (
                        <span>Complete Registration</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* Footnote Link to Main Website */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="text-[11px] text-gray-400">NACOS FUTO Portal v2.4</span>
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

export default Register;

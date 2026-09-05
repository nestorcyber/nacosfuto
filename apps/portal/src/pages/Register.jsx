import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCloudinaryAssetUrl } from '@nacos/media';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Mail, 
  KeyRound, 
  RotateCw, 
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Shield
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
  // Step 1: Matric Lookup, Step 2: Personal Details & OTP, Step 3: Password Creation
  const [step, setStep] = useState(1);

  // Form states
  const [matricNumber, setMatricNumber] = useState('');
  const [verifiedRecord, setVerifiedRecord] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [devTestCode, setDevTestCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UI status states
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
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
        setError(lookup.error?.message || 'User not found, contact admin.');
        setIsLookingUp(false);
        return;
      }

      setVerifiedRecord(lookup.data);
      // Move to Step 2 for personal details & email verification
      setStep(2);
    } catch (err) {
      setError('An error occurred during verification lookup. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  // =========================================================================
  // STEP 2: Send OTP Code to student's typed email
  // =========================================================================
  const handleSendCode = async (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanEmail = studentEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsSendingCode(true);
    try {
      const dispatch = await sendStudentVerificationCode(matricNumber.trim(), cleanEmail);
      if (dispatch.success) {
        setDevTestCode(dispatch.code || '');
        setResendCooldown(60);
        setCodeSent(true);
      } else {
        setError(dispatch.error?.message || 'Failed to dispatch verification code. Please check your email and try again.');
      }
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || !matricNumber || !studentEmail) return;
    await handleSendCode();
  };

  // =========================================================================
  // STEP 2: Validate Student Names, Mandatory Phone (for 2FA) & 6-digit OTP
  // =========================================================================
  const handleConfirmCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }

    if (!lastName.trim()) {
      setError('Please enter your last name / surname.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[\s\-()]/g, '');
    if (!cleanPhone) {
      setError('Contact phone number is compulsory for two-factor authentication (2FA).');
      return;
    }

    if (cleanPhone.length < 10) {
      setError('Please enter a valid contact phone number (at least 10 digits). Required for 2FA.');
      return;
    }

    const cleanEmail = studentEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

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
      const fullName = [firstName.trim(), middleName.trim(), lastName.trim()].filter(Boolean).join(' ');
      const res = await completeVerifiedStudentRegistration(
        matricNumber.trim(),
        verificationCode.trim(),
        password,
        phone.trim(),
        studentEmail.trim(),
        fullName
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

        {/* Authentic NACOS Brand Text */}
        <div className="relative z-10 max-w-lg space-y-2 mt-auto pt-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-snug tracking-tight">
            Your NACOS account unlocks a world of computing excellence
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 font-normal">
            Department of Computer Science • Federal University of Technology, Owerri
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
                {step === 1 && 'Registration Check'}
                {step === 2 && 'Personal Details & Code'}
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
              {step === 1 && 'Student Registration'}
              {step === 2 && 'Personal Details & Verification'}
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
                Welcome to NACOS FUTO, <strong>{[firstName, lastName].filter(Boolean).join(' ') || 'Student'}</strong>. Redirecting you to your student dashboard...
              </p>
            </div>
          ) : (
            <div>

              {/* ========================================================
                  STEP 1: REGISTRATION NUMBER LOOKUP
                  ======================================================== */}
              {step === 1 && (
                <form onSubmit={handleVerifyRegistrationNumber} className="space-y-4">
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
                          <span>Please wait...</span>
                        </>
                      ) : (
                        <span>Continue</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================
                  STEP 2: STUDENT DETAILS, MANDATORY 2FA PHONE & OTP
                  ======================================================== */}
              {step === 2 && verifiedRecord && (
                <form onSubmit={handleConfirmCode} className="space-y-4">
                  {/* First Name & Middle Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Chukwuemeka"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-medium transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Emmanuel"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-medium transition-all"
                      />
                    </div>
                  </div>

                  {/* Last Name / Surname */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Last Name / Surname *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Okonkwo"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-medium transition-all"
                    />
                  </div>

                  {/* Contact Phone Number - Compulsory for 2FA */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Contact Phone Number *
                      </label>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#138601] bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        <Shield className="w-3 h-3 text-[#138601]" />
                        Compulsory for 2FA
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 08012345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-medium transition-all"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Required for two-factor authentication (2FA) and account security verification.
                    </p>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Email Address *
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          required
                          placeholder="e.g. yourname@gmail.com"
                          value={studentEmail}
                          onChange={(e) => {
                            setStudentEmail(e.target.value);
                            if (codeSent) setCodeSent(false);
                          }}
                          className="w-full pl-10 pr-4 py-2.5 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-medium transition-all"
                        />
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                      </div>
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={isSendingCode || !studentEmail.trim()}
                        className="px-4 py-2.5 text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5 whitespace-nowrap"
                      >
                        {isSendingCode ? (
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Mail className="w-3.5 h-3.5" />
                        )}
                        <span>{codeSent ? (resendCooldown > 0 ? `${resendCooldown}s` : 'Resend') : 'Send Code'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Enter your active personal or school email to receive your 6-digit verification code.
                    </p>
                  </div>

                  {/* Code Sent Notice */}
                  {codeSent && (
                    <div className="p-3 rounded bg-green-50 border border-green-200 text-xs text-green-900 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#138601] mt-0.5 shrink-0" />
                      <div>
                        A 6-digit verification code has been dispatched to <strong>{studentEmail}</strong>. Enter it below to proceed.
                      </div>
                    </div>
                  )}

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
                        className="text-[11px] text-emerald-700 underline font-semibold hover:text-emerald-900 cursor-pointer"
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
                      placeholder="e.g. 123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 text-base text-center tracking-widest font-mono font-bold rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-1 focus:ring-black transition-all"
                    />
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
                        <span>Continue</span>
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
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end text-xs text-gray-500">
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

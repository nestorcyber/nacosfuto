import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCloudinaryAssetUrl } from '@nacos/media';
import studentPhoto from '../assets/gallery_student_group.jpg';
import logoDark from '../assets/full-logo-dark.png';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { registerStudent } from '@nacos/supabase/auth';
import { parseAdmissionYear, calculateCurrentLevel, calculateExpectedGraduation, CURRENT_ACADEMIC_YEAR_START } from '@nacos/config/academic';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Personal Bio, 2: Academic Info, 3: Security & Passwords

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    matricNumber: '',
    email: '',
    department: 'Computer Science',
    faculty: 'School of Information & Communication Tech (SICT)',
    institution: 'Federal University of Technology, Owerri (FUTO)',
    level: '100 Level',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Real-time automatic admission year & academic level detection
  const detectedAcademic = useMemo(() => {
    if (!formData.matricNumber || formData.matricNumber.trim().length < 4) {
      return null;
    }
    const parse = parseAdmissionYear(formData.matricNumber, CURRENT_ACADEMIC_YEAR_START);
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
  }, [formData.matricNumber]);

  // Step 1 Validation -> Proceed to Step 2
  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!formData.middleName.trim()) {
      setError('Middle name is required.');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required.');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Step 2 Validation -> Proceed to Step 3
  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!formData.matricNumber.trim()) {
      setError('Registration number is required.');
      return;
    }
    if (!detectedAcademic || !detectedAcademic.valid) {
      setError(detectedAcademic?.error || 'Please enter a valid registration number (digits only, e.g. 20241029481).');
      return;
    }
    if (!formData.email.trim()) {
      setError('Student email address is required.');
      return;
    }
    setError('');
    setStep(3);
  };

  // Step 3 Final Submission
  const handleSubmitFinal = async (e) => {
    e.preventDefault();
    if (!formData.password) {
      setError('Password is required.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('You must confirm that you are a registered student of FUTO.');
      return;
    }

    setError('');
    setIsLoading(true);

    const fullName = `${formData.firstName.trim()} ${formData.middleName.trim()} ${formData.lastName.trim()}`;
    const studentPayload = {
      fullName,
      matricNumber: formData.matricNumber.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      programme: 'B.Tech Computer Science',
      department: formData.department,
      faculty: formData.faculty,
      programmeDuration: 5
    };

    const res = await registerStudent(studentPayload);
    setIsLoading(false);

    if (res.error) {
      setError(res.error.message || 'Registration failed. Please check your details.');
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
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

      {/* RIGHT HALF (50%): Clean Multi-Step Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-14 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-5 my-auto">
          
          {/* Header & Step Tracker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#138601]">
                Step {step} of 3
              </span>
              <span className="text-xs text-gray-500">
                {step === 1 && 'Personal Details'}
                {step === 2 && 'Academic Verification'}
                {step === 3 && 'Security & Account'}
              </span>
            </div>

            {/* Simple Step Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-[#138601] transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
              {step === 1 && 'Personal Information'}
              {step === 2 && 'Academic Verification'}
              {step === 3 && 'Create Password'}
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#138601] font-semibold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded bg-red-50 text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-14 h-14 rounded-full bg-green-100 text-[#138601] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Registration Complete!</h2>
              <p className="text-xs text-gray-500">Redirecting to your student academic dashboard...</p>
            </div>
          ) : (
            <div>

              {/* ========================================================
                  STEP 1: PERSONAL INFORMATION (First, Middle, Last Names & Phone)
                  ======================================================== */}
              {step === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chukwuemeka"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Middle Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Emmanuel"
                      value={formData.middleName}
                      onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Last Name / Surname *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Okonkwo"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Active Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08012345678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full px-7 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <span>Continue to Academic Info</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================
                  STEP 2: ACADEMIC DETAILS & REGNUMBER VERIFICATION
                  ======================================================== */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-3.5">
                  {/* Notice Box */}
                  <div className="p-3 rounded bg-[#ebf3ff]/70 border border-[#cbe1ff] text-xs text-gray-700 leading-relaxed">
                    <span className="font-semibold text-gray-900">Notice:</span> Please enter the <strong>exact same email address</strong> you used on the FUTO portal when you joined FUTO.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Registration Number (Digits only, no letters) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20241029481"
                      value={formData.matricNumber}
                      onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  {/* Real-time Academic Level and Admission Year Detection Callout */}
                  {detectedAcademic && (
                    <div className={`p-3 rounded border text-xs transition-all ${
                      detectedAcademic.valid 
                        ? 'bg-green-50/80 border-green-200 text-green-900' 
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}>
                      {detectedAcademic.valid ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Auto-Detected Admission Year:</span>
                            <span className="font-bold text-[#138601]">{detectedAcademic.admissionYear}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Calculated Current Level:</span>
                            <span className="font-bold text-[#138601]">{detectedAcademic.levelString}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">Expected Graduation Year:</span>
                            <span className="font-bold text-gray-700">{detectedAcademic.expectedGraduation}</span>
                          </div>
                        </div>
                      ) : (
                        <p>{detectedAcademic.error}</p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Student Email Address (from FUTO portal) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@futo.edu.ng"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Department & Faculty
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Computer Science • SICT, FUTO"
                      className="w-full px-4 py-2.5 text-xs rounded bg-gray-100 text-gray-600 border-0 font-medium"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 min-h-[42px] text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-7 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      <span>Continue to Security</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================
                  STEP 3: SECURITY & ACCOUNT SETUP (Password & Confirmation)
                  ======================================================== */}
              {step === 3 && (
                <form onSubmit={handleSubmitFinal} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 text-sm rounded bg-[#ebf3ff] text-gray-900 placeholder-gray-500 border-0 focus:outline-none focus:ring-1 focus:ring-black font-normal transition-all"
                    />
                  </div>

                  {/* Confirmation Terms Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      required
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 mt-0.5 text-[#138601] border-gray-300 rounded focus:ring-[#138601] cursor-pointer"
                    />
                    <label htmlFor="agreeTerms" className="ml-2 text-xs text-gray-600 select-none cursor-pointer leading-relaxed">
                      I confirm that I am a registered student in good standing with NACOS and FUTO.
                    </label>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 min-h-[42px] text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-7 py-2.5 min-h-[42px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center justify-center"
                    >
                      {isLoading ? 'Creating account...' : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* Minimal Footnote Link to Main Website */}
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

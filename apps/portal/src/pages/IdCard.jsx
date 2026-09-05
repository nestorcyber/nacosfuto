import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { 
  CreditCard, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Printer, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  FileText, 
  ArrowRight, 
  Info,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { 
  getIdCardSettings,
  getStudentIdApplication,
  createIdCardApplication,
  verifyAndLinkPayment,
  recordStudentPayment,
  savePassportToApplication,
  submitIdApplication,
  drawIdCardOnCanvas, 
  downloadIdCardAsImage, 
  downloadIdCardAsPdf 
} from '@nacos/supabase/idCard';
import { ID_CARD_TEMPLATE } from '@nacos/config/idCardTemplate';
import { MediaUpload, CLOUDINARY_FOLDERS, getOptimizedImageUrl } from '@nacos/media';

const IdCard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ id_card_fee: 2500, academic_session: '2026/2027' });
  const [application, setApplication] = useState(null);

  // Interaction feedback states
  const [isApplying, setIsApplying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    loadStudentAndApplication();
  }, []);

  const loadStudentAndApplication = async () => {
    setLoading(true);
    const stored = localStorage.getItem('nacos_user');
    if (!stored) {
      navigate('/login');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setStudent(parsed);

      // Load settings
      const cfg = await getIdCardSettings();
      if (cfg) setSettings(cfg);

      // Load application
      const matric = parsed.matric || parsed.registration_number;
      const app = await getStudentIdApplication(matric);
      setApplication(app);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Redraw canvas whenever application reaches 'generated' state
  useEffect(() => {
    if (application && application.status === 'generated' && canvasRef.current && student) {
      const photoUrl = application.passport_url || student.profile_photo_url || student.avatar_url;
      if (photoUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          drawIdCardOnCanvas(canvasRef.current, student, img, application);
        };
        img.onerror = () => {
          drawIdCardOnCanvas(canvasRef.current, student, null, application);
        };
        img.src = photoUrl;
      } else {
        drawIdCardOnCanvas(canvasRef.current, student, null, application);
      }
    }
  }, [application, student]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4500);
  };

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  // State 1 -> State 2: Student clicks "Apply for ID Card"
  const handleApply = async () => {
    setIsApplying(true);
    const res = await createIdCardApplication(student);
    setIsApplying(false);

    if (res.error) {
      showNotification(res.error, 'error');
    } else {
      setApplication(res.application);
      showNotification('ID Card application initiated successfully!');
    }
  };

  // State 2 -> State 3: Payment
  const handlePayment = async () => {
    setIsPaying(true);
    const matric = student.matric || student.registration_number;
    const fee = settings.id_card_fee || 2500;

    // Simulate payment transaction record
    const payRes = await recordStudentPayment(matric, fee);
    if (!payRes.success) {
      setIsPaying(false);
      showNotification('Payment processing failed. Please try again.', 'error');
      return;
    }

    // Verify & link with application
    const linkRes = await verifyAndLinkPayment(application?.id, matric);
    setIsPaying(false);

    if (linkRes.error) {
      showNotification(linkRes.error, 'error');
    } else {
      setApplication(linkRes.application);
      showNotification('Payment verified & recorded successfully!');
    }
  };

  // State 3 -> State 4: Photo Upload
  const handlePhotoUploaded = (media) => {
    const photoUrl = media.secureUrl || media.url;
    setApplication(prev => ({
      ...prev,
      passport_url: photoUrl,
      cloudinary_public_id: media.publicId,
      status: 'ready_to_submit'
    }));
    setStudent(prev => ({
      ...prev,
      profile_photo_url: photoUrl,
      avatar_url: photoUrl,
      cloudinary_public_id: media.publicId
    }));
    showNotification('Passport photograph uploaded to Cloudinary successfully!');
  };

  // State 4 -> State 5: Submit Application
  const handleSubmitApplication = async () => {
    if (!application?.id) return;
    setIsSubmitting(true);
    const res = await submitIdApplication(application.id);
    setIsSubmitting(false);

    if (res.error) {
      showNotification(res.error, 'error');
    } else {
      setApplication(res.application);
      showNotification('Your ID card application has been submitted for review!');
    }
  };

  // Reapply after rejection / revocation
  const handleReapply = async () => {
    setIsApplying(true);
    const res = await createIdCardApplication(student);
    setIsApplying(false);
    if (res.application) {
      setApplication(res.application);
      showNotification('New application started.');
    }
  };

  // Downloads
  const handleDownloadImage = () => {
    if (!canvasRef.current || !student) return;
    const rawName = (student.name || student.full_name || 'Student').replace(/[^a-zA-Z0-9]/g, '-');
    const rawId = (application?.id_card_number || 'NACOS-ID').replace(/[^a-zA-Z0-9]/g, '-');
    downloadIdCardAsImage(canvasRef.current, `${rawName}-${rawId}`);
  };

  const handleDownloadPdf = () => {
    if (!canvasRef.current || !student) return;
    const rawName = (student.name || student.full_name || 'Student').replace(/[^a-zA-Z0-9]/g, '-');
    const rawId = (application?.id_card_number || 'NACOS-ID').replace(/[^a-zA-Z0-9]/g, '-');
    downloadIdCardAsPdf(canvasRef.current, `${rawName}-${rawId}`);
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <RefreshCw className="w-7 h-7 text-[#138601] animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Verifying ID application status & records...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  // ---------------------------------------------------------------------------
  // Determine Exact State (1 through 9)
  // ---------------------------------------------------------------------------
  // State 1: Not Applied (application is null)
  // State 2: Payment Pending ('pending_payment')
  // State 3: Payment Confirmed / Photo Required ('photo_required' or 'payment_confirmed' with no photo)
  // State 4: Ready to Submit ('ready_to_submit' or payment verified + photo exists but not submitted)
  // State 5: Processing / Submitted ('submitted' or 'processing')
  // State 6: Approved / Preparing ('approved')
  // State 7: Generated ('generated')
  // State 8: Rejected ('rejected')
  // State 9: Revoked ('revoked')

  const appStatus = application?.status;
  const isState1 = !application;
  const isState2 = application && (appStatus === 'pending_payment' || (application.payment_status !== 'verified' && appStatus !== 'rejected' && appStatus !== 'revoked'));
  const isState3 = application && application.payment_status === 'verified' && (appStatus === 'photo_required' || !application.passport_url);
  const isState4 = application && application.payment_status === 'verified' && application.passport_url && appStatus === 'ready_to_submit';
  const isState5 = application && (appStatus === 'submitted' || appStatus === 'processing');
  const isState6 = application && appStatus === 'approved';
  const isState7 = application && appStatus === 'generated';
  const isState8 = application && appStatus === 'rejected';
  const isState9 = application && appStatus === 'revoked';

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Title Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#138601] dark:text-[#4bd043]" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Student ID Card Application & Issuance
              </h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-green-100/70">
              Department of Computer Science • Federal University of Technology, Owerri
            </p>
          </div>

          <div className="flex items-center gap-2">
            {application && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isState7 
                  ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50' 
                  : isState8 || isState9
                  ? 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700/50'
                  : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50'
              }`}>
                {isState7 ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                <span className="capitalize">
                  {isState7 ? 'Active & Cleared' : (application.status || 'In Progress').replace(/_/g, ' ')}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Global Notification Banner */}
        {notification.message && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-sm transition-all ${
            notification.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800' 
              : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* ====================================================================
            STATE 1: NOT APPLIED (Initial On-Demand State)
            ==================================================================== */}
        {isState1 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] flex items-center justify-center mx-auto border border-[#138601]/30">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Get Your NACOS Student ID Card
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                The official NACOS FUTO Student Identity Card is an on-demand credential that grants you access to departmental computing laboratories, election voting rights, academic library clearance, and verified national member benefits.
              </p>
            </div>

            {/* Checklist of What You Need */}
            <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-white">
                  <CreditCard className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                  <span>ID Card Fee</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-green-200/70">
                  Current fee: <strong className="text-[#138601] dark:text-[#4bd043]">₦{settings.id_card_fee?.toLocaleString() || '2,500'}</strong> for session {settings.academic_session}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-gray-900 dark:text-white">
                  <Camera className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                  <span>Passport Photo</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-green-200/70">
                  A front-facing, high-resolution portrait photograph on a light background.
                </p>
              </div>
            </div>

            {/* Apply Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying}
                className="px-8 py-3.5 min-h-[46px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isApplying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isApplying ? 'Initiating Application...' : 'Apply for ID Card'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 2: PAYMENT REQUIRED (Pending Payment)
            ==================================================================== */}
        {isState2 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Payment Required to Continue
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Your ID card application (<span className="font-mono font-bold text-gray-800 dark:text-white">{application.application_number}</span>) has been initiated. Complete the departmental dues & ID card fee to unlock passport upload.
              </p>
            </div>

            {/* Invoice Summary Box */}
            <div className="p-5 rounded-xl max-w-md mx-auto bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 text-xs text-left space-y-2.5">
              <div className="flex justify-between pb-2 border-b border-gray-200 dark:border-[#138601]/20">
                <span className="text-gray-500 dark:text-green-200/60">Student Reg No:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{student.matric || student.registration_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-green-200/60">Purpose:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Departmental Dues & ID Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-green-200/60">Academic Session:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{settings.academic_session}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-[#138601]/20 text-sm">
                <span className="font-bold text-gray-700 dark:text-gray-300">Amount Payable:</span>
                <span className="font-bold text-[#138601] dark:text-[#4bd043]">₦{settings.id_card_fee?.toLocaleString() || '2,500'}.00</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePayment}
                disabled={isPaying}
                className="px-8 py-3.5 min-h-[46px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isPaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>{isPaying ? 'Verifying Transaction with Gateway...' : `Pay Fee (₦${settings.id_card_fee?.toLocaleString() || '2,500'})`}</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 3: PAYMENT CONFIRMED / PHOTO REQUIRED
            ==================================================================== */}
        {isState3 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800/40">
              <Camera className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" /> Payment Verified ({application.payment_reference || 'CLEARED'})
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Upload Passport Photograph
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Your payment is verified. Please upload a clear front-facing photograph to complete your ID card application.
              </p>
            </div>

            {uploadError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-xs text-red-600 font-semibold max-w-md mx-auto">
                {uploadError}
              </div>
            )}

            <div className="max-w-sm mx-auto text-left">
              <MediaUpload
                folder={CLOUDINARY_FOLDERS.STUDENTS}
                publicId={`${CLOUDINARY_FOLDERS.STUDENTS}/${(student.matric || student.registration_number || 'student').replace(/[^a-zA-Z0-9]/g, '_')}_passport`}
                label="Passport Photograph (JPG/PNG/WebP, max 5MB)"
                helperText="Clear front portrait with neutral background"
                aspectRatio="portrait"
                previewPreset="id_card_photo"
                onUploadSuccess={handlePhotoUploaded}
                onError={(err) => setUploadError(err)}
              />
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 4: READY TO SUBMIT (Review & Submit Application)
            ==================================================================== */}
        {isState4 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-[#138601] dark:text-[#4bd043] flex items-center justify-center mx-auto border border-green-300 dark:border-green-800">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Review & Submit Your Application
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Please verify your details and photograph before submitting your application for administrator review.
              </p>
            </div>

            {/* Profile Confirmation Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 flex items-center gap-5 text-left">
              <img
                src={application.passport_url || student.profile_photo_url}
                alt="Passport Photo"
                className="w-20 h-24 object-cover rounded-xl border-2 border-[#138601] shadow-sm"
              />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-sm text-gray-900 dark:text-white">{student.name || student.full_name}</div>
                <div className="font-mono text-[#138601] dark:text-[#4bd043] font-semibold">{student.matric || student.registration_number}</div>
                <div className="text-gray-500 dark:text-green-200/70">{student.level || student.current_level} • {student.programme || 'B.Tech Computer Science'}</div>
                <div className="text-[11px] text-gray-400 dark:text-green-200/50 pt-1">
                  App No: {application.application_number}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setApplication(prev => ({ ...prev, status: 'photo_required' }))}
                className="px-5 py-3 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
              >
                Change Photograph
              </button>

              <button
                type="button"
                onClick={handleSubmitApplication}
                disabled={isSubmitting}
                className="px-8 py-3 text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application for Review'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 5: PROCESSING (Under Review by Portal Admin)
            ==================================================================== */}
        {isState5 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40 animate-pulse">
              <Clock className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                Status: Application Under Review
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Your ID Application is Being Reviewed
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Your application has been received and is currently undergoing verification by the NACOS Student Portal Administrator. Once approved, your official digital ID card will be generated automatically.
              </p>
            </div>

            <div className="p-5 rounded-xl max-w-sm mx-auto bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Application Number:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{application.application_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">Verified & Cleared</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submitted On:</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {application.submitted_at ? new Date(application.submitted_at).toLocaleDateString() : 'Today'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 6: APPROVED / PREPARING
            ==================================================================== */}
        {isState6 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/20 text-[#138601] dark:text-[#4bd043] flex items-center justify-center mx-auto border border-green-200">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your ID Card is Being Prepared</h2>
            <p className="text-xs text-gray-500 dark:text-green-100/80">
              Application approved! Generating high-resolution digital security assets...
            </p>
          </div>
        )}

        {/* ====================================================================
            STATE 7: GENERATED (Active Official Digital ID Card)
            ==================================================================== */}
        {isState7 && (
          <div className="space-y-6">
            
            {/* Visual Canvas ID Card Preview Container */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#138601]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      Official Student Identity Card
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-green-200/70 mt-0.5">
                    Official CR-80 format with scannable QR verification and dynamic watermark.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/verify/id/${application.id_card_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 dark:text-green-200 bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public Verify Page</span>
                  </a>
                </div>
              </div>

              {/* High-Resolution HTML5 Canvas Card */}
              <div className="flex justify-center items-center py-2 overflow-x-auto">
                <div className="max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl border border-[#138601]/40">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-auto block"
                    style={{ aspectRatio: `${ID_CARD_TEMPLATE.dimensions.aspectRatio}` }}
                  />
                </div>
              </div>

              {/* Download Buttons Bar */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#138601]/20">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="px-5 py-2.5 min-h-[42px] text-xs font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-black rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-7 py-2.5 min-h-[42px] text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Download PDF</span>
                </button>
              </div>
            </div>

            {/* Verification & Metadata Summary */}
            <div className="p-5 rounded-xl bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 text-xs space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                <span>Card Validity & Details</span>
              </h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-green-100/70 space-y-1">
                <li>NACOS ID Number: <strong className="font-mono text-gray-900 dark:text-white">{application.id_card_number}</strong></li>
                <li>Valid for Session: <strong className="text-gray-900 dark:text-white">{settings.academic_session}</strong></li>
                <li>Present this digital or printed card for departmental verification, election voting, and lab access.</li>
              </ul>
            </div>

          </div>
        )}

        {/* ====================================================================
            STATE 8: REJECTED
            ==================================================================== */}
        {isState8 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-red-200 dark:border-red-900/50 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold">
                Application Rejected
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Action Required on Your Application
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Your ID card application was not approved. Please review the feedback below and update your submission.
              </p>
            </div>

            {/* Rejection Reason Box */}
            <div className="p-4 rounded-xl max-w-md mx-auto bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-left space-y-1.5">
              <span className="font-bold text-red-800 dark:text-red-300">Administrator Feedback:</span>
              <p className="text-red-700 dark:text-red-200">
                {application.rejection_reason || 'Photograph did not meet passport criteria. Please upload a clear front-facing photo on a light background.'}
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleReapply}
                className="px-8 py-3.5 min-h-[46px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Update Photo & Re-submit</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STATE 9: REVOKED
            ==================================================================== */}
        {isState9 && (
          <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-[#083002] border border-red-300 dark:border-red-900 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto border border-red-300">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-200 text-xs font-bold uppercase tracking-wider">
                Card Revoked
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Your ID Card Has Been Revoked
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                This student identity card ({application.id_card_number || 'N/A'}) has been officially revoked by the NACOS Directorate. It will no longer scan as valid on the verification registry.
              </p>
            </div>

            <div className="p-4 rounded-xl max-w-md mx-auto bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 text-xs text-left">
              <span className="font-semibold text-gray-500">Reason for Revocation:</span>
              <p className="font-medium text-gray-900 dark:text-white mt-1">
                {application.revocation_reason || 'Academic session expired or clearance revoked.'}
              </p>
            </div>

            {settings.allow_reapplication_on_revoke && (
              <div>
                <button
                  type="button"
                  onClick={handleReapply}
                  className="px-8 py-3.5 min-h-[46px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Submit New Application</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default IdCard;

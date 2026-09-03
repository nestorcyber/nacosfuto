import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/PortalLayout';
import { 
  CreditCard, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  FileText, 
  RefreshCw, 
  ShieldCheck, 
  User, 
  ArrowRight,
  Camera,
  Printer
} from 'lucide-react';
import { 
  checkStudentPaymentStatus, 
  recordStudentPayment, 
  validateAndSaveProfilePhoto, 
  getOrGenerateIdCard, 
  drawIdCardOnCanvas, 
  downloadIdCardAsImage, 
  downloadIdCardAsPdf 
} from '@nacos/supabase/idCard';
import { ID_CARD_TEMPLATE } from '@nacos/config/idCardTemplate';

const IdCard = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState({ isPaid: false, payment: null });
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [cardGenerated, setCardGenerated] = useState(false);
  const [cardRecord, setCardRecord] = useState(null);

  // Interaction feedback states
  const [isPaying, setIsPaying] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    loadStudentAndStatus();
  }, []);

  const loadStudentAndStatus = async () => {
    setLoading(true);
    const stored = localStorage.getItem('nacos_user');
    if (!stored) {
      navigate('/login');
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setStudent(parsed);

      const matric = parsed.matric || parsed.registration_number;
      // 1. Verify payment status from database
      const paymentCheck = await checkStudentPaymentStatus(matric);
      setPaymentStatus(paymentCheck);

      // 2. Check profile photo
      const photo = parsed.avatar_url || parsed.photo_url;
      if (photo) {
        setHasPhoto(true);
        setPhotoPreview(photo);
      } else {
        setHasPhoto(false);
        setPhotoPreview(null);
      }

      // 3. Check if card was previously generated
      if (paymentCheck.isPaid && photo) {
        const idRes = await getOrGenerateIdCard(parsed);
        if (idRes.success) {
          setCardGenerated(true);
          setCardRecord(idRes.card);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Redraw canvas whenever card is generated or photo changes
  useEffect(() => {
    if (cardGenerated && canvasRef.current && student) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        drawIdCardOnCanvas(canvasRef.current, student, img);
      };
      img.onerror = () => {
        drawIdCardOnCanvas(canvasRef.current, student, null);
      };
      if (photoPreview) {
        img.src = photoPreview;
      } else {
        drawIdCardOnCanvas(canvasRef.current, student, null);
      }
    }
  }, [cardGenerated, student, photoPreview]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
  };

  // Action: Pay Dues & ID Card Fee
  const handleMakePayment = async () => {
    setIsPaying(true);
    const matric = student.matric || student.registration_number;
    const res = await recordStudentPayment(matric, 2500);
    setIsPaying(false);

    if (res.success) {
      setPaymentStatus({ isPaid: true, payment: res.payment });
      showNotification('Payment verified and cleared successfully!');
      
      // If photo already exists, auto-generate
      if (hasPhoto) {
        handleGenerateCard();
      }
    }
  };

  // Action: Upload Profile Photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setIsUploadingPhoto(true);

    const matric = student.matric || student.registration_number;
    const res = await validateAndSaveProfilePhoto(student.id || matric, file);
    setIsUploadingPhoto(false);

    if (res.error) {
      setUploadError(res.error);
    } else {
      setHasPhoto(true);
      setPhotoPreview(res.photoUrl);
      setStudent(prev => ({ ...prev, avatar_url: res.photoUrl, photo_url: res.photoUrl }));
      showNotification('Passport photograph saved to your official profile!');
    }
  };

  // Action: Generate ID Card
  const handleGenerateCard = async () => {
    setIsGenerating(true);
    const res = await getOrGenerateIdCard(student);
    setIsGenerating(false);

    if (res.error) {
      showNotification(res.error.message, 'error');
    } else {
      setCardGenerated(true);
      setCardRecord(res.card);
      showNotification('Official ID Card generated successfully!');
    }
  };

  // Action: Download PDF
  const handleDownloadPdf = () => {
    if (!canvasRef.current || !student) return;
    const rawName = (student.name || student.full_name || 'Student').replace(/[^a-zA-Z0-9]/g, '-');
    const rawReg = (student.matric || student.registration_number || '2024CS12345').replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `${rawName}-${rawReg}-ID-Card`;
    downloadIdCardAsPdf(canvasRef.current, filename);
  };

  // Action: Download PNG Image
  const handleDownloadImage = () => {
    if (!canvasRef.current || !student) return;
    const rawName = (student.name || student.full_name || 'Student').replace(/[^a-zA-Z0-9]/g, '-');
    const rawReg = (student.matric || student.registration_number || '2024CS12345').replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `${rawName}-${rawReg}-ID-Card`;
    downloadIdCardAsImage(canvasRef.current, filename);
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-2">
            <RefreshCw className="w-7 h-7 text-[#138601] animate-spin mx-auto" />
            <p className="text-xs text-gray-500 font-medium">Verifying student records & clearance...</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  // Determine current access state
  // State 1: Payment not completed
  // State 2: Payment completed, but photo missing
  // State 3: Payment completed + photo available (ready to generate)
  // State 4: ID generated (preview & download)
  const isState1 = !paymentStatus.isPaid;
  const isState2 = paymentStatus.isPaid && !hasPhoto;
  const isState3 = paymentStatus.isPaid && hasPhoto && !cardGenerated;
  const isState4 = paymentStatus.isPaid && hasPhoto && cardGenerated;

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-[#138601] dark:text-[#4bd043]" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Official Student Identity Card
              </h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-green-100/70">
              Department of Computer Science • Federal University of Technology, Owerri
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold ${
              paymentStatus.isPaid 
                ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50' 
                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50'
            }`}>
              {paymentStatus.isPaid ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              <span>{paymentStatus.isPaid ? 'Payment Verified & Cleared' : 'Payment Required'}</span>
            </span>
          </div>
        </div>

        {/* Global Notification */}
        {notification.message && (
          <div className={`p-3.5 rounded text-xs font-semibold flex items-center gap-2 shadow-sm ${
            notification.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* ================================================================
            STATE 1: PAYMENT NOT COMPLETED
            ================================================================ */}
        {isState1 && (
          <div className="p-8 sm:p-12 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200 dark:border-amber-800/40">
              <CreditCard className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                ID Card Unavailable
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                You need to complete the official departmental dues and ID card clearance payment before you can generate and download your student ID card.
              </p>
            </div>

            <div className="p-4 rounded max-w-sm mx-auto bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Student Reg No:</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{student.matric || student.registration_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Item:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">Departmental Dues & ID Card</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Payable:</span>
                <span className="font-bold text-[#138601] dark:text-[#4bd043]">₦2,500.00</span>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleMakePayment}
                disabled={isPaying}
                className="px-8 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isPaying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>{isPaying ? 'Processing Clearance...' : 'Make Payment (₦2,500)'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            STATE 2: PAYMENT COMPLETED, BUT PHOTO MISSING
            ================================================================ */}
        {isState2 && (
          <div className="p-8 sm:p-12 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800/40">
              <Camera className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <span className="inline-block px-3 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold">
                ✓ Payment Confirmed & Cleared
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Profile Photo Required
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Before generating your student ID card, please upload a clear, front-facing passport-style photograph to your student profile.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded bg-red-50 text-xs text-red-600 font-semibold max-w-md mx-auto">
                {uploadError}
              </div>
            )}

            <div className="max-w-sm mx-auto p-6 rounded border-2 border-dashed border-gray-300 dark:border-[#138601]/40 bg-gray-50 dark:bg-[#041801] hover:border-[#138601] transition-colors">
              <input
                type="file"
                id="photoInput"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={isUploadingPhoto}
                className="hidden"
              />
              <label htmlFor="photoInput" className="cursor-pointer space-y-2 block">
                <Upload className="w-8 h-8 text-[#138601] mx-auto" />
                <div className="text-xs font-bold text-gray-900 dark:text-white">
                  {isUploadingPhoto ? 'Uploading photograph...' : 'Click to select passport photo'}
                </div>
                <p className="text-[10px] text-gray-500">
                  Accepted: JPG, PNG, WebP (Max 5MB)
                </p>
              </label>
            </div>
          </div>
        )}

        {/* ================================================================
            STATE 3: PAYMENT COMPLETED + PHOTO READY (Ready to Generate)
            ================================================================ */}
        {isState3 && (
          <div className="p-8 sm:p-12 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-[#138601] dark:text-[#4bd043] flex items-center justify-center mx-auto border border-green-300 dark:border-green-800">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Your ID Card is Ready to Generate
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-green-100/80 leading-relaxed">
                Your dues clearance has been verified and your profile photograph is confirmed. Click the button below to generate your official identity card.
              </p>
            </div>

            {/* Profile Confirmation Card */}
            <div className="max-w-sm mx-auto p-4 rounded bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 flex items-center gap-4 text-left">
              <img
                src={photoPreview}
                alt="Passport Photo"
                className="w-16 h-20 object-cover rounded border border-[#138601]"
              />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-gray-900 dark:text-white">{student.name || student.full_name}</div>
                <div className="font-mono text-[#138601] dark:text-[#4bd043]">{student.matric || student.registration_number}</div>
                <div className="text-gray-500 dark:text-green-200/70">{student.level || student.current_level} • {student.dept || student.department}</div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGenerateCard}
                disabled={isGenerating}
                className="px-8 py-3 min-h-[44px] text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-md transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{isGenerating ? 'Rendering High-Res ID Card...' : 'Generate ID Card'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================================================================
            STATE 4: ID CARD GENERATED (PREVIEW & DOWNLOAD)
            ================================================================ */}
        {isState4 && (
          <div className="space-y-6">
            
            {/* Visual Canvas ID Card Preview Container */}
            <div className="p-6 sm:p-8 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#138601]/20 pb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Generated Student ID Card Preview
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-green-200/70">
                    Official CR-80 high-resolution format with dynamic security watermark and verified QR hash.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('reuploadPhotoInput')?.click();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-gray-700 dark:text-white bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-black transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Photo</span>
                  </button>
                  <input
                    type="file"
                    id="reuploadPhotoInput"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* High-Resolution HTML5 Canvas (Responsive Display) */}
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
                  className="px-5 py-2.5 min-h-[42px] text-xs font-semibold text-gray-800 dark:text-white bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-black rounded transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="px-7 py-2.5 min-h-[42px] text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Download / Print ID Card (PDF)</span>
                </button>
              </div>
            </div>

            {/* Verification & Usage Guidelines Card */}
            <div className="p-5 rounded bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/20 text-xs space-y-2">
              <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                <span>Card Validity & Guidelines</span>
              </h4>
              <ul className="list-disc list-inside text-gray-600 dark:text-green-100/70 space-y-1">
                <li>This identity card is valid for the current academic session ({student.academic_session || '2026/2027'}).</li>
                <li>Your name and registration number are dynamically locked and cannot be edited manually.</li>
                <li>Present this card for departmental clearance, voting at NACOS elections, and lab access.</li>
              </ul>
            </div>

          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default IdCard;

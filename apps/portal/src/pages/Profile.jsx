import React, { useState, useEffect } from 'react';
import { 
  User, 
  QrCode, 
  ShieldCheck, 
  Download, 
  Edit3, 
  Check, 
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';
import logoDark from '../assets/full-logo-dark.png';
import { MediaUpload, CloudinaryImage, CLOUDINARY_FOLDERS } from '@nacos/media';
import { syncMediaAsset } from '@nacos/supabase/media';
import { supabase } from '@nacos/supabase';

const Profile = () => {
  const [user, setUser] = useState({
    name: 'David Okonkwo',
    matric: '2022/139481',
    email: 'david.okonkwo@futo.edu.ng',
    phone: '+234 814 592 0184',
    level: '300 Level',
    dept: 'Computer Science',
    faculty: 'School of Information & Communication Tech (SICT)',
    stateOfOrigin: 'Anambra State',
    bloodGroup: 'O+',
    genotype: 'AA',
    nextOfKin: 'Mrs. Ngozi Okonkwo (+234 803 112 3456)',
    nacosId: 'NACOS/FUTO/22/0948',
    membershipStatus: 'Active & Verified',
    expiryDate: 'October 2026'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nacos_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    localStorage.setItem('nacos_user', JSON.stringify(user));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Student Profile & Digital ID E-Card
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 font-normal mt-0.5">
              Official institutional bio-data records and verifiable digital NACOS student ID card.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-xs font-semibold text-[#138601] dark:text-[#4bd043] flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Updated!
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-semibold text-gray-700 dark:text-white bg-[#f1f3f5] dark:bg-[#083002] hover:bg-[#e9ecef] dark:hover:bg-[#138601] transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit Bio-Data'}</span>
            </button>
          </div>
        </div>

        {/* 2-Col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* DIGITAL NACOS E-CARD */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Digital NACOS Student E-Card</h3>
            
            {/* Visual E-Card Container (subtle 4px-6px rounded corners) */}
            <div className="relative rounded p-6 bg-[#083002] border border-[#138601]/40 text-white space-y-4">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#138601]/30 pb-3">
                <div className="flex items-center space-x-2.5">
                  <img src={logoDark} alt="NACOS Logo" className="h-7 w-auto object-contain" />
                  <div>
                    <h4 className="text-xs font-bold leading-none">NACOS FUTO</h4>
                    <span className="text-[10px] text-green-300">Department of Computer Science</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-[#138601]/40 text-[#4bd043] px-2 py-0.5 rounded">
                  Student E-Card
                </span>
              </div>

              {/* Student Details & Photo Avatar */}
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded bg-[#138601] flex items-center justify-center text-white text-lg font-bold shrink-0 overflow-hidden border border-[#4bd043]/30">
                  {user.profile_photo_url || user.avatar_url ? (
                    <CloudinaryImage
                      src={user.profile_photo_url || user.avatar_url}
                      alt={user.name}
                      preset="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    user.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div className="overflow-hidden space-y-0.5">
                  <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                  <div className="text-xs text-[#4bd043] font-mono">{user.matric}</div>
                  <div className="text-xs text-green-200/80 font-normal">{user.dept} ({user.level})</div>
                </div>
              </div>

              {/* Card Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#138601]/20 text-xs">
                <div>
                  <span className="text-[10px] text-green-300/70 block">NACOS Reg ID</span>
                  <span className="font-semibold text-white font-mono">{user.nacosId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-green-300/70 block">Card Expiry</span>
                  <span className="font-semibold text-white">{user.expiryDate}</span>
                </div>
              </div>

              {/* Barcode / QR Section */}
              <div className="pt-3 border-t border-[#138601]/20 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-[#4bd043] flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3 h-3" /> Validated Chapter Member
                  </span>
                  <div className="text-[9px] text-green-200/60 font-mono">HASH: 9A81-2025-FUTO-CSC</div>
                </div>
                <QrCode className="w-7 h-7 text-[#4bd043]" />
              </div>

            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Digital ID (PDF)</span>
            </button>

            {/* Cloudinary Passport Photo Management */}
            <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-3">
              <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                <span>Official Passport Photo</span>
                <span className="text-[10px] font-normal text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded">
                  Cloudinary CDN
                </span>
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-green-200/70 leading-relaxed">
                Your photograph is processed with automated face centering and optimized for your digital student ID card.
              </p>
              <MediaUpload
                currentImageUrl={user.profile_photo_url || user.avatar_url || ''}
                currentPublicId={user.cloudinary_public_id || ''}
                folder={CLOUDINARY_FOLDERS.STUDENTS}
                publicId={`${CLOUDINARY_FOLDERS.STUDENTS}/${(user.matric || 'student').replace(/[^a-zA-Z0-9]/g, '_')}_passport`}
                label=""
                helperText="JPG, PNG, or WebP passport photo (Max 5MB)"
                aspectRatio="portrait"
                previewPreset="id_card_photo"
                onUploadSuccess={async ({ url, publicId }) => {
                  const updated = {
                    ...user,
                    profile_photo_url: url,
                    avatar_url: url,
                    photo_url: url,
                    cloudinary_public_id: publicId
                  };
                  setUser(updated);
                  localStorage.setItem('nacos_user', JSON.stringify(updated));

                  // Two-way sync: Save to Supabase media_assets & update student profile
                  const regNum = user.matric || user.registration_number;
                  await syncMediaAsset({
                    publicId,
                    url,
                    folder: CLOUDINARY_FOLDERS.STUDENTS,
                    category: 'students',
                    image_alt: `Student Passport - ${user.name || regNum}`,
                    entity_type: 'student_passport',
                    entity_id: String(regNum)
                  });

                  if (user.id || regNum) {
                    try {
                      await supabase.from('profiles').update({
                        profile_photo_url: url,
                        avatar_url: url,
                        cloudinary_public_id: publicId
                      }).or(`id.eq.${user.id || '00000000-0000-0000-0000-000000000000'},registration_number.eq.${regNum}`);
                    } catch (e) {
                      console.warn('Supabase profile photo update bypassed', e);
                    }
                  }

                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2500);
                }}
                onDeleteSuccess={async () => {
                  const updated = {
                    ...user,
                    profile_photo_url: '',
                    avatar_url: '',
                    photo_url: '',
                    cloudinary_public_id: ''
                  };
                  setUser(updated);
                  localStorage.setItem('nacos_user', JSON.stringify(updated));

                  const regNum = user.matric || user.registration_number;
                  if (user.id || regNum) {
                    try {
                      await supabase.from('profiles').update({
                        profile_photo_url: null,
                        avatar_url: null,
                        cloudinary_public_id: null
                      }).or(`id.eq.${user.id || '00000000-0000-0000-0000-000000000000'},registration_number.eq.${regNum}`);
                    } catch (e) {}
                  }
                }}
              />
            </div>
          </div>

          {/* COMPREHENSIVE BIO-DATA FORM / VIEW */}
          <div className="lg:col-span-7">
            <div className="p-5 sm:p-6 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#138601]/20 pb-2.5">
                Official Institutional Bio-Data
              </h3>

              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-gray-50 dark:bg-[#041801] border border-gray-300 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Student Email</label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-gray-50 dark:bg-[#041801] border border-gray-300 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">WhatsApp / Phone</label>
                      <input
                        type="tel"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-gray-50 dark:bg-[#041801] border border-gray-300 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">State of Origin</label>
                      <input
                        type="text"
                        value={user.stateOfOrigin}
                        onChange={(e) => setUser({ ...user, stateOfOrigin: e.target.value })}
                        className="w-full px-3 py-2 rounded bg-gray-50 dark:bg-[#041801] border border-gray-300 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-black transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded text-white font-semibold bg-[#138601] hover:bg-[#0f6c01] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Full Legal Name</span>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{user.name}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Matriculation Number</span>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white font-mono">{user.matric}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Student Email</span>
                    <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Phone Number</span>
                    <span className="font-medium text-gray-900 dark:text-white">{user.phone}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Programme</span>
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">{user.programme || 'B.Tech Computer Science'}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Admission Year</span>
                    <span className="font-bold text-[#138601] dark:text-[#4bd043]">{user.admission_year || (user.matric ? user.matric.substring(0, 4) : '2024')}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Current Academic Level</span>
                    <span className="font-bold text-[#138601] dark:text-[#4bd043]">{user.level || user.current_level || '300 Level'}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Programme Duration & Expected Graduation</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.programme_duration || 5} Years • Class of {user.expected_graduation_year || (parseInt(user.admission_year || (user.matric ? user.matric.substring(0, 4) : 2024), 10) + (user.programme_duration || 5))}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">State of Origin</span>
                    <span className="font-medium text-gray-900 dark:text-white">{user.stateOfOrigin || 'Imo State'}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Medical Info</span>
                    <span className="font-medium text-gray-900 dark:text-white">Genotype: {user.genotype || 'AA'} • Blood Group: {user.bloodGroup || 'O+'}</span>
                  </div>

                  <div className="sm:col-span-2 pt-1">
                    <span className="text-gray-500 dark:text-green-200/70 block mb-0.5">Next of Kin Contact</span>
                    <span className="font-medium text-gray-900 dark:text-white">{user.nextOfKin || 'Mrs. Ngozi Okonkwo (+234 803 112 3456)'}</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
};

export default Profile;

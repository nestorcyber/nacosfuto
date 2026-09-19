import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  GraduationCap, 
  MapPin, 
  ChevronDown, 
  Check, 
  RotateCcw
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';
import { uploadMedia, CLOUDINARY_FOLDERS } from '@nacos/media';
import { syncMediaAsset } from '@nacos/supabase/media';
import { supabase } from '@nacos/supabase';

// Helper to parse user data from localStorage without any hardcoded mock
const loadStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('nacos_user');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const fullName = (parsed.fullName || parsed.full_name || parsed.name || '').trim();
      const parts = fullName ? fullName.split(/\s+/) : [];
      
      const firstName = parsed.firstName || parsed.first_name || (parts.length > 1 ? parts[1] : parts[0] || '');
      const surname = parsed.lastName || parsed.surname || (parts.length > 1 ? parts[0] : '');
      const matric = parsed.regNo || parsed.registration_number || parsed.matric || parsed.studentId || parsed.student_id || '';
      const dept = parsed.department || parsed.dept || 'Computer Science';
      const deptCode = parsed.dept_code || (dept.toLowerCase().includes('software') ? 'SE' : 'CSC');
      const avatar = parsed.avatar || parsed.profile_photo_url || parsed.avatar_url || parsed.photo_url || '';

      return {
        id: parsed.id || matric,
        surname,
        firstName,
        name: fullName || `${surname} ${firstName}`.trim(),
        matric,
        studentId: matric,
        dept_code: deptCode,
        email: parsed.email || '',
        phone: parsed.phone || parsed.phone_number || '',
        dob: parsed.dob || parsed.date_of_birth || '',
        dobFormatted: parsed.dobFormatted || parsed.dob || parsed.date_of_birth || '',
        address: parsed.address || parsed.residential_address || '',
        bio: parsed.bio || '',
        institution: parsed.institution || parsed.university || 'Federal University of Technology, Owerri (FUTO)',
        level: parsed.level || parsed.current_level || '100 Level',
        dept,
        zone: parsed.zone || 'South East',
        gender: parsed.gender || 'M',
        avatar_url: avatar,
        profile_photo_url: avatar,
        cloudinary_public_id: parsed.cloudinary_public_id || ''
      };
    } catch (e) {
      console.error('Failed to parse nacos_user', e);
    }
  }
  return null;
};

const Profile = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Dynamic user state initialized from session / localStorage
  const [user, setUser] = useState(() => {
    return loadStoredUser() || {
      surname: '',
      firstName: '',
      name: '',
      matric: '',
      studentId: '',
      dept_code: 'CSC',
      email: '',
      phone: '',
      dob: '',
      dobFormatted: '',
      address: '',
      bio: '',
      institution: 'FEDERAL UNIVERSITY OF TECHNOLOGY, OWERRI, IMO STATE',
      level: '100 Level',
      dept: 'Computer Science',
      zone: 'South East',
      gender: 'M',
      avatar_url: '',
      profile_photo_url: '',
      cloudinary_public_id: ''
    };
  });

  // Re-sync with localStorage whenever storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const freshUser = loadStoredUser();
      if (freshUser) setUser(freshUser);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('nacos_user_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nacos_user_updated', handleStorageChange);
    };
  }, []);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    
    const fullName = `${user.surname} ${user.firstName}`.trim();
    const updatedUser = {
      ...user,
      name: fullName,
      full_name: fullName,
      registration_number: user.studentId || user.matric,
      matric: user.studentId || user.matric,
      email: user.email,
      phone_number: user.phone,
      phone: user.phone,
      department: user.dept,
      dept: user.dept,
      level: user.level,
      current_level: user.level,
      institution: user.institution,
      address: user.address,
      bio: user.bio,
      zone: user.zone,
      gender: user.gender,
      dob: user.dob,
      dobFormatted: user.dobFormatted || user.dob,
      profile_photo_url: user.profile_photo_url || user.avatar_url,
      avatar_url: user.avatar_url || user.profile_photo_url
    };

    setUser(updatedUser);
    localStorage.setItem('nacos_user', JSON.stringify(updatedUser));

    // Also update local students database if present
    try {
      const dbRaw = localStorage.getItem('nacos_students_db');
      if (dbRaw) {
        const db = JSON.parse(dbRaw);
        const idx = db.findIndex(s => 
          s.registration_number === updatedUser.registration_number || 
          (updatedUser.id && s.id === updatedUser.id)
        );
        if (idx >= 0) {
          db[idx] = { ...db[idx], ...updatedUser };
          localStorage.setItem('nacos_students_db', JSON.stringify(db));
        }
      }
    } catch (err) {}

    // Update Supabase if online
    if (supabase && (updatedUser.id || updatedUser.registration_number)) {
      try {
        supabase.from('profiles').update({
          full_name: updatedUser.full_name,
          email: updatedUser.email,
          phone_number: updatedUser.phone_number,
          department: updatedUser.department,
          profile_photo_url: updatedUser.profile_photo_url,
          avatar_url: updatedUser.avatar_url,
          address: updatedUser.address,
          bio: updatedUser.bio
        }).or(`id.eq.${updatedUser.id || '00000000-0000-0000-0000-000000000000'},registration_number.eq.${updatedUser.registration_number}`);
      } catch (err) {}
    }

    // Dispatch global events so sidebar & dashboard update in real-time
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('nacos_user_updated', { detail: updatedUser }));

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const localUrl = URL.createObjectURL(file);
    const updated = {
      ...user,
      avatar_url: localUrl,
      profile_photo_url: localUrl
    };
    setUser(updated);
    localStorage.setItem('nacos_user', JSON.stringify(updated));

    // Notify other components of photo update
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('nacos_user_updated', { detail: updated }));

    try {
      const regNum = user.matric || user.studentId || 'student';
      const result = await uploadMedia(file, {
        folder: CLOUDINARY_FOLDERS.STUDENTS,
        publicId: `${CLOUDINARY_FOLDERS.STUDENTS}/${regNum.replace(/[^a-zA-Z0-9]/g, '_')}_avatar`,
        tags: ['student_avatar', 'nacos']
      });

      if (result.success) {
        const cloudUrl = result.secureUrl || result.url;
        const finalUpdated = {
          ...user,
          avatar_url: cloudUrl,
          profile_photo_url: cloudUrl,
          cloudinary_public_id: result.publicId
        };
        setUser(finalUpdated);
        localStorage.setItem('nacos_user', JSON.stringify(finalUpdated));

        await syncMediaAsset({
          publicId: result.publicId,
          url: cloudUrl,
          folder: CLOUDINARY_FOLDERS.STUDENTS,
          category: 'students',
          image_alt: `Student Avatar - ${user.name || user.full_name}`,
          entity_type: 'student_avatar',
          entity_id: String(regNum)
        });

        if (supabase) {
          try {
            await supabase.from('profiles').update({
              profile_photo_url: cloudUrl,
              avatar_url: cloudUrl,
              cloudinary_public_id: result.publicId
            }).or(`registration_number.eq.${regNum}`);
          } catch (err) {}
        }

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('nacos_user_updated', { detail: finalUpdated }));
      }
    } catch (err) {
      console.warn('Background avatar upload error:', err);
    } finally {
      setIsUploadingPhoto(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const displayName = (user.name || `${user.surname} ${user.firstName}`).trim() || 'Student Profile';
  const displayMatric = user.matric || user.studentId || 'Not Set';
  const displayInitials = displayName
    .split(/\s+/)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  return (
    <PortalLayout>
      <div className="space-y-6">

        {/* ─── Top Header Card (Dynamic User Information) ─── */}
        <div className="bg-white dark:bg-[#083002] rounded border border-gray-200/80 dark:border-[#138601]/30 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          
          {/* Avatar & Core Profile Summary */}
          <div className="flex items-center space-x-4 sm:space-x-5">
            
            {/* Avatar Container with Camera Overlay */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded overflow-hidden border border-gray-200 dark:border-[#138601]/40 bg-gray-100 dark:bg-[#041801] shadow-xs group cursor-pointer"
              title="Click to change profile photo"
            >
              {user.profile_photo_url || user.avatar_url ? (
                <img 
                  src={user.profile_photo_url || user.avatar_url} 
                  alt={displayName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={`w-full h-full flex items-center justify-center bg-[#138601] text-white font-bold text-2xl ${user.profile_photo_url || user.avatar_url ? 'hidden' : ''}`}
              >
                {displayInitials}
              </div>
              
              {/* Camera Icon Overlay */}
              <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/50 flex items-center justify-center text-gray-700 dark:text-[#4bd043] shadow-xs group-hover:bg-[#138601] group-hover:text-white transition-all">
                <Camera className="w-3.5 h-3.5" />
              </div>

              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-semibold">
                  Uploading...
                </div>
              )}
            </div>

            {/* Hidden File Input for Avatar Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Student Name, ID & Badges */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  {displayName}
                </h2>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-50 dark:bg-[#138601]/20 text-[#138601] dark:text-[#4bd043] border border-green-200 dark:border-[#138601]/30" title="Active Student Account">
                  <RotateCcw className="w-2.5 h-2.5" />
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-green-200/80">
                {displayMatric} • {user.dept_code || 'CSC'}
              </p>
              
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1.5 text-xs">
                {/* Level Badge */}
                <span className="px-3 py-1 rounded text-xs font-semibold border border-green-200 dark:border-[#138601]/40 text-[#138601] dark:text-[#4bd043] bg-green-50/60 dark:bg-[#138601]/10 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{user.level || '100 Level'}</span>
                </span>

                {/* Institution Badge */}
                <span className="text-xs font-semibold uppercase tracking-wide text-[#138601] dark:text-[#4bd043] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-[280px] sm:max-w-none">{user.institution}</span>
                </span>

                {/* Gender Badge */}
                <span className="w-6 h-6 rounded border border-green-200 dark:border-[#138601]/40 text-xs font-bold text-[#138601] dark:text-[#4bd043] flex items-center justify-center">
                  {user.gender || 'M'}
                </span>
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {saveSuccess && (
              <span className="text-xs font-semibold text-[#138601] dark:text-[#4bd043] flex items-center gap-1 bg-green-50 dark:bg-[#138601]/20 px-2.5 py-1 rounded">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}

            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
              className="px-6 py-2.5 rounded text-sm font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>

        </div>

        {/* ─── Two-Column Form Cards (Dynamic User Information) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Personal Information */}
          <div className="bg-white dark:bg-[#083002] rounded border border-gray-200/80 dark:border-[#138601]/30 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/70 mt-0.5">Your personal details</p>
            </div>

            <div className="space-y-3.5 pt-2">
              
              {/* Surname & First Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Surname</label>
                  <input
                    type="text"
                    value={user.surname}
                    disabled={!isEditing}
                    placeholder="Enter surname"
                    onChange={(e) => setUser({ ...user, surname: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={user.firstName}
                    disabled={!isEditing}
                    placeholder="Enter first name"
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={user.email}
                  disabled={!isEditing}
                  placeholder="student@futo.edu.ng"
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                />
              </div>

              {/* Phone Number & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={user.phone}
                    disabled={!isEditing}
                    placeholder="080XXXXXXXX"
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Date of Birth</label>
                  <input
                    type="text"
                    value={user.dobFormatted || user.dob}
                    disabled={!isEditing}
                    placeholder="MM/DD/YYYY"
                    onChange={(e) => setUser({ ...user, dobFormatted: e.target.value, dob: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Address</label>
                <input
                  type="text"
                  value={user.address}
                  disabled={!isEditing}
                  placeholder="Enter residential address"
                  onChange={(e) => setUser({ ...user, address: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  value={user.bio}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself, tech interests, or roles..."
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200 resize-y"
                />
              </div>

            </div>
          </div>

          {/* Card 2: Academic Information */}
          <div className="bg-white dark:bg-[#083002] rounded border border-gray-200/80 dark:border-[#138601]/30 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">Academic Information</h3>
            </div>

            <div className="space-y-3.5 pt-2">
              
              {/* Institution */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Institution</label>
                <input
                  type="text"
                  value={user.institution}
                  disabled={!isEditing}
                  onChange={(e) => setUser({ ...user, institution: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-gray-50/60 dark:bg-[#041801]/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                />
              </div>

              {/* Student ID */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Student ID</label>
                <input
                  type="text"
                  value={user.studentId || user.matric}
                  disabled={!isEditing}
                  placeholder="e.g. 20241429481"
                  onChange={(e) => setUser({ ...user, studentId: e.target.value, matric: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-gray-50/60 dark:bg-[#041801]/60 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200"
                />
              </div>

              {/* Current Level */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Current Level</label>
                <div className="relative">
                  <select
                    value={user.level}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, level: e.target.value })}
                    className="w-full appearance-none px-4 py-2.5 pr-10 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200 cursor-pointer"
                  >
                    <option value="100 Level">100 Level</option>
                    <option value="200 Level">200 Level</option>
                    <option value="300 Level">300 Level</option>
                    <option value="400 Level">400 Level</option>
                    <option value="500 Level">500 Level</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-green-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Department</label>
                <div className="relative">
                  <select
                    value={user.dept}
                    disabled={!isEditing}
                    onChange={(e) => {
                      const newDept = e.target.value;
                      const code = newDept.toLowerCase().includes('software') ? 'SE' : 'CSC';
                      setUser({ ...user, dept: newDept, dept_code: code });
                    }}
                    className="w-full appearance-none px-4 py-2.5 pr-10 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200 cursor-pointer"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Information Technology">Information Technology</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-green-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Zone */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-green-200 block mb-1.5">Zone</label>
                <div className="relative">
                  <select
                    value={user.zone}
                    disabled={!isEditing}
                    onChange={(e) => setUser({ ...user, zone: e.target.value })}
                    className="w-full appearance-none px-4 py-2.5 pr-10 text-xs sm:text-sm rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601] disabled:bg-gray-50/50 dark:disabled:bg-[#041801]/50 disabled:text-gray-700 dark:disabled:text-gray-200 cursor-pointer"
                  >
                    <option value="South East">South East</option>
                    <option value="South South">South South</option>
                    <option value="South West">South West</option>
                    <option value="North Central">North Central</option>
                    <option value="North East">North East</option>
                    <option value="North West">North West</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-green-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </PortalLayout>
  );
};

export default Profile;

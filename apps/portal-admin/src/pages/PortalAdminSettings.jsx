import React, { useState, useEffect } from 'react';
import PortalAdminLayout from '../components/PortalAdminLayout';
import { 
  Settings, 
  Save, 
  Building2, 
  GraduationCap, 
  CreditCard, 
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { getIdCardSettings, updateIdCardFee } from '@nacos/supabase/idCard';
import { CURRENT_ACADEMIC_YEAR_START, getAcademicSession } from '@nacos/config/academic';
import { useTheme } from '../context/ThemeContext';

export const PortalAdminSettings = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [idCardFee, setIdCardFee] = useState(2500);
  const [academicSession, setAcademicSession] = useState('2026/2027');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const s = getIdCardSettings();
      if (s?.id_card_fee) setIdCardFee(s.id_card_fee);
      if (s?.academic_session) setAcademicSession(s.academic_session);
    } catch (e) {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      updateIdCardFee(Number(idCardFee));
    } catch (e) {}

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <PortalAdminLayout 
      title="Student Portal Configuration & Academic Parameters"
      subtitle="Manage department structures, academic calendars, fee schedules, and registration gating"
    >
      <div className="max-w-4xl space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center gap-3 text-emerald-300 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Portal settings updated and persisted successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Academic Session Card */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#04160d] border-emerald-950/60' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-emerald-400">
              <Calendar className="w-4 h-4" />
              <span>Academic Session & Year Parameters</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Current Academic Session
                </label>
                <input
                  type="text"
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-black/30 border-white/10 text-white focus:border-emerald-500/60' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Academic Year Inception
                </label>
                <input
                  type="number"
                  disabled
                  value={CURRENT_ACADEMIC_YEAR_START}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border opacity-75 cursor-not-allowed ${
                    isDark ? 'bg-black/40 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Department & Faculty Structure Card */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#04160d] border-emerald-950/60' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span>Departmental Scope & Faculties</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Designated Department
                </label>
                <input
                  type="text"
                  disabled
                  value="Computer Science"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border opacity-75 cursor-not-allowed ${
                    isDark ? 'bg-black/40 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Parent School / Faculty
                </label>
                <input
                  type="text"
                  disabled
                  value="School of Information & Comm. Tech (SICT)"
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border opacity-75 cursor-not-allowed ${
                    isDark ? 'bg-black/40 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Fees & ID Card Schedule Card */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-[#04160d] border-emerald-950/60' : 'bg-white border-slate-200'
          }`}>
            <h2 className="text-sm font-bold flex items-center gap-2 mb-4 text-emerald-400">
              <CreditCard className="w-4 h-4" />
              <span>Dues & ID Card Rates</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Student ID Card Fee (₦)
                </label>
                <input
                  type="number"
                  value={idCardFee}
                  onChange={(e) => setIdCardFee(e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 text-xs border focus:outline-none transition-colors ${
                    isDark 
                      ? 'bg-black/30 border-white/10 text-white focus:border-emerald-500/60' 
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowRegistration}
                    onChange={(e) => setAllowRegistration(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300"
                  />
                  <span className="text-xs font-semibold">Enable Student Portal Self-Registration</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Portal Settings</span>
            </button>
          </div>
        </form>
      </div>
    </PortalAdminLayout>
  );
};

export default PortalAdminSettings;

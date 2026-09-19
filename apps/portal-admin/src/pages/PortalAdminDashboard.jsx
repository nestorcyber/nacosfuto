import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  GraduationCap, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';
import PortalAdminLayout from '../components/PortalAdminLayout';
import { adminGetAllVerifiedStudents } from '@nacos/supabase/verifiedStudents';
import { adminGetAllStudents } from '@nacos/supabase/auth';
import { portalAdminGetApplications } from '@nacos/supabase/idCard';
import { useTheme } from '../context/ThemeContext';

export const PortalAdminDashboard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    whitelistTotal: 0,
    activeAccounts: 0,
    pendingIdCards: 0,
    approvedIdCards: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [whitelistRes, accountsRes, idCardsRes] = await Promise.all([
        adminGetAllVerifiedStudents(),
        adminGetAllStudents(),
        portalAdminGetApplications('ALL')
      ]);

      const whitelist = whitelistRes.success ? (whitelistRes.students || []) : [];
      const accounts = accountsRes.success ? (accountsRes.students || []) : [];
      const idCards = idCardsRes.success ? (idCardsRes.applications || []) : [];

      const pending = idCards.filter(c => c.status === 'PENDING').length;
      const approved = idCards.filter(c => c.status === 'APPROVED').length;

      setStats({
        whitelistTotal: whitelist.length,
        activeAccounts: accounts.length,
        pendingIdCards: pending,
        approvedIdCards: approved
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Verified Whitelist',
      value: stats.whitelistTotal,
      subtitle: 'Eligible CS student records',
      icon: Users,
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400',
      link: '/students'
    },
    {
      title: 'Active Portal Users',
      value: stats.activeAccounts,
      subtitle: 'Registered student accounts',
      icon: GraduationCap,
      color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
      link: '/students'
    },
    {
      title: 'Pending ID Cards',
      value: stats.pendingIdCards,
      subtitle: 'Awaiting officer review',
      icon: Clock,
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
      link: '/id-cards'
    },
    {
      title: 'Approved ID Cards',
      value: stats.approvedIdCards,
      subtitle: 'Digitally issued cards',
      icon: CheckCircle2,
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400',
      link: '/id-cards'
    }
  ];

  return (
    <PortalAdminLayout 
      title="Student Portal Operations Dashboard" 
      subtitle="Comprehensive overview of verified student registry, active portal accounts, and digital ID card applications"
    >
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link
                key={i}
                to={stat.link}
                className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isDark ? 'bg-[#083002]/40 backdrop-blur border-[#138601]/25 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-green-200/70 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`p-2 rounded-xl border bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-extrabold tracking-tight text-inherit">
                    {loading ? '...' : stat.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Action Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Management Module */}
          <div className={`p-6 rounded-2xl border lg:col-span-2 ${
            isDark ? 'bg-[#083002]/40 backdrop-blur border-[#138601]/25 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-900'
          }`}>
            <h2 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
              <span>Key Operational Actions</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/students"
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  isDark 
                    ? 'bg-black/20 border-[#138601]/20 hover:border-[#138601] hover:bg-[#083002]/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-[#138601] hover:bg-green-50/50'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[#138601] dark:text-[#4bd043] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-inherit">Verified Student Whitelist</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    View, add, batch import CSV, and manage registered student whitelists.
                  </p>
                </div>
              </Link>

              <Link
                to="/id-cards"
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  isDark 
                    ? 'bg-black/20 border-[#138601]/20 hover:border-[#138601] hover:bg-[#083002]/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-[#138601] hover:bg-green-50/50'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-inherit">Review ID Card Applications</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Approve passports, reject substandard photos, and inspect QR verification codes.
                  </p>
                </div>
              </Link>

              <Link
                to="/media"
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  isDark 
                    ? 'bg-black/20 border-[#138601]/20 hover:border-[#138601] hover:bg-[#083002]/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-[#138601] hover:bg-green-50/50'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-inherit">Student Media & ID Photos</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Access student passport galleries and digital identity assets.
                  </p>
                </div>
              </Link>

              <Link
                to="/settings"
                className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                  isDark 
                    ? 'bg-black/20 border-[#138601]/20 hover:border-[#138601] hover:bg-[#083002]/60' 
                    : 'bg-gray-50 border-gray-200 hover:border-[#138601] hover:bg-green-50/50'
                }`}
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-inherit">Portal Session & Settings</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    Configure active academic sessions, departmental dues, and registration controls.
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Quick Summary Info Panel */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'bg-[#083002]/40 backdrop-blur border-[#138601]/25 text-white' : 'bg-white border-gray-200 shadow-sm text-gray-900'
          }`}>
            <h2 className="text-base font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
              <span>Verification System Status</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-inherit">
                <span className="font-bold text-[#138601] dark:text-[#4bd043] block mb-1">
                  Institutional Whitelist Active
                </span>
                <p className="text-[11px] text-gray-600 dark:text-green-200/70 leading-relaxed">
                  Only students whose registration numbers, emails, and phone numbers match the verified ground truth can create student accounts.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-inherit">
                <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">
                  OTP Delivery Providers
                </span>
                <p className="text-[11px] text-gray-600 dark:text-blue-200/70 leading-relaxed">
                  Zero-Serverless direct verification active: <strong>Resend</strong> for email verification and <strong>Termii</strong> for Nigerian mobile SMS verification.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/students"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#138601] hover:bg-[#0f6c01] text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Open Student Registry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PortalAdminLayout>
  );
};

export default PortalAdminDashboard;

import React, { useState, useEffect } from 'react';
import WebsiteAdminLayout from '../../components/admin/WebsiteAdminLayout';
import { Users, UserPlus, ShieldCheck, ShieldAlert, CheckCircle, AlertCircle, RefreshCw, KeyRound, Edit2 } from 'lucide-react';
import { superAdminGetAdmins, superAdminInviteAdmin, superAdminUpdatePermissions, getWebsiteAdminSession } from '@nacos/supabase/adminAuth';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    scope: 'main_website',
    role: 'website_admin',
    permissions: ['main_website.view', 'main_website.media', 'main_website.gallery', 'main_website.news', 'main_website.events']
  });

  const availablePermissions = [
    { key: 'main_website.view', label: 'View Dashboard & Content' },
    { key: 'main_website.media', label: 'Manage Media & Cloudinary' },
    { key: 'main_website.gallery', label: 'Campus Gallery Editor' },
    { key: 'main_website.news', label: 'News & Journal Publishing' },
    { key: 'main_website.events', label: 'Events & Flyer Management' },
    { key: 'main_website.homepage', label: 'Homepage Hero & Banner CMS' },
    { key: 'main_website.settings', label: 'Website Settings & Config' }
  ];

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    const list = await superAdminGetAdmins();
    setAdmins(list || []);
    setLoading(false);
  };

  const handleTogglePermission = (permKey) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permKey);
      return {
        ...prev,
        permissions: exists 
          ? prev.permissions.filter(p => p !== permKey)
          : [...prev.permissions, permKey]
      };
    });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    const res = await superAdminInviteAdmin(formData);
    if (res.error) {
      setNotification({ message: res.error, type: 'error' });
    } else {
      setNotification({ message: `Administrator ${formData.email} created successfully!`, type: 'success' });
      setIsInviteModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        scope: 'main_website',
        role: 'website_admin',
        permissions: ['main_website.view', 'main_website.media']
      });
      loadAdmins();
    }
  };

  return (
    <WebsiteAdminLayout
      title="Administrator Management"
      subtitle="Super Admin Oversight • Invite administrators, configure role scopes, and manage granular permissions."
    >
      <div className="space-y-6">
        
        {notification.message && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/60 dark:text-red-300'
              : 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950/60 dark:text-green-300'
          }`}>
            {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Active Administrators: <strong className="text-gray-900 dark:text-white">{admins.length}</strong>
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-sm inline-flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Administrator</span>
          </button>
        </div>

        {/* Admins Table */}
        <div className="rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin text-[#138601] mx-auto mb-2" />
              Loading administrators...
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#041801] border-b border-gray-200 dark:border-[#138601]/30 text-gray-600 dark:text-green-200/80 uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Scope</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#138601]/20">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-gray-50/50 dark:hover:bg-[#041801]/40">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 dark:text-white">{adm.full_name}</div>
                      <div className="text-gray-500 dark:text-green-200/70 text-[11px]">{adm.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#138601]/20 text-[#138601] dark:text-[#4bd043]">
                        {adm.scope}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-medium text-gray-800 dark:text-gray-200">
                      {adm.role.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {adm.permissions?.includes('*') ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">Universal (*)</span>
                        ) : (
                          adm.permissions?.map(p => (
                            <span key={p} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#041801] text-gray-600 dark:text-green-200 text-[9px]">
                              {p.replace('main_website.', '')}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        adm.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {adm.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Invite Modal */}
        {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#138601]/20">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Invite Website Administrator
                </h3>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400">✕</button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Scope</label>
                    <select
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30"
                    >
                      <option value="main_website">main_website</option>
                      <option value="student_portal">student_portal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30"
                    >
                      <option value="website_admin">website_admin</option>
                      <option value="website_editor">website_editor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-2">Granular Permissions</label>
                  <div className="space-y-1.5">
                    {availablePermissions.map(p => (
                      <label key={p.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(p.key)}
                          onChange={() => handleTogglePermission(p.key)}
                          className="w-3.5 h-3.5 text-[#138601] rounded"
                        />
                        <span>{p.label} <code className="text-[10px] text-gray-400">({p.key})</code></span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-[#138601]/20">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-white bg-[#138601] hover:bg-[#0f6c01] font-semibold"
                  >
                    Create Administrator
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </WebsiteAdminLayout>
  );
};

export default AdminUsers;

import React, { useState, useEffect } from 'react';
import WebsiteAdminLayout from '../components/WebsiteAdminLayout';
import { Users, UserPlus, ShieldCheck, ShieldAlert, CheckCircle, AlertCircle, RefreshCw, KeyRound, Edit2, Layers, BookOpen, Award, GraduationCap } from 'lucide-react';
import { superAdminGetAdmins, superAdminInviteAdmin, AVAILABLE_ADMIN_FEATURES } from '@nacos/supabase/adminAuth';

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
    assigned_level: 'all',
    permissions: [
      'main_website.view',
      'main_website.media',
      'feature:yellow_pages',
      'feature:campus_clubs',
      'feature:alumni_management'
    ]
  });

  const availablePermissions = [
    { key: 'main_website.view', label: 'View Dashboard & Content', group: 'Platform: Main Website' },
    { key: 'main_website.media', label: 'Manage Media & Assets', group: 'Platform: Main Website' },
    { key: 'main_website.gallery', label: 'Campus Gallery Editor', group: 'Platform: Main Website' },
    { key: 'main_website.news', label: 'News & Journal Publishing', group: 'Platform: Main Website' },
    { key: 'main_website.events', label: 'Events & Flyer Management', group: 'Platform: Main Website' },
    { key: 'student_portal.students', label: 'Portal Student Registry', group: 'Platform: Student Portal' },
    { key: 'student_portal.results', label: 'Portal Results & Grading', group: 'Platform: Student Portal' },
    { key: 'student_portal.id_cards', label: 'Portal ID Card Processing', group: 'Platform: Student Portal' }
  ];

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    const res = await superAdminGetAdmins();
    setAdmins(Array.isArray(res) ? res : res?.admins || []);
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

  const handleRoleChange = (role) => {
    let defaultPerms = [];
    let scope = formData.scope;
    let level = formData.assigned_level;

    if (role === 'course_adviser') {
      scope = 'student_portal';
      level = '200';
      defaultPerms = [
        'student_portal.results',
        'student_portal.students',
        'feature:results_management',
        'feature:student_registry',
        'feature:course_management'
      ];
    } else if (role === 'website_admin') {
      scope = 'main_website';
      defaultPerms = [
        'main_website.view',
        'main_website.media',
        'main_website.news',
        'main_website.events',
        'feature:yellow_pages',
        'feature:campus_clubs',
        'feature:alumni_management'
      ];
    } else if (role === 'portal_admin') {
      scope = 'student_portal';
      defaultPerms = [
        'student_portal.students',
        'student_portal.results',
        'student_portal.id_cards',
        'feature:student_registry',
        'feature:results_management',
        'feature:id_management',
        'feature:resource_management'
      ];
    } else if (role === 'super_admin') {
      scope = 'super_admin';
      defaultPerms = ['*'];
    }

    setFormData(prev => ({
      ...prev,
      role,
      scope,
      assigned_level: level,
      permissions: defaultPerms
    }));
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
        assigned_level: 'all',
        permissions: ['main_website.view', 'main_website.media', 'feature:yellow_pages']
      });
      loadAdmins();
    }
  };

  return (
    <WebsiteAdminLayout
      title="Administrator Management"
      subtitle="Super Admin Oversight • Assign administrators by platform and granular feature scopes (e.g. Course Advisers, Yellow Pages, ID Management)."
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
            className="px-4 py-2 text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Administrator</span>
          </button>
        </div>

        {/* Admins Table */}
        <div className="rounded-2xl border border-gray-200 dark:border-[#138601]/30 bg-white dark:bg-[#083002] overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400">Loading administrator registry...</div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#041801] border-b border-gray-200 dark:border-[#138601]/30 text-gray-500 dark:text-green-200/70 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Admin Name / Email</th>
                  <th className="py-3 px-4">Platform Scope</th>
                  <th className="py-3 px-4">Role / Level</th>
                  <th className="py-3 px-4">Assigned Features & Permissions</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#138601]/20">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 dark:text-white">{adm.full_name || 'Administrator'}</div>
                      <div className="text-[11px] text-gray-500 dark:text-green-200/60">{adm.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-green-50 text-[#138601] border border-green-200 dark:bg-[#041801] dark:text-[#4bd043] dark:border-[#138601]/30">
                        {adm.scope || 'main_website'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-800 dark:text-green-100 capitalize">
                        {(adm.role || 'Admin').replace(/_/g, ' ')}
                      </div>
                      {adm.assigned_level && adm.assigned_level !== 'all' && (
                        <span className="text-[10px] text-amber-600 font-bold">
                          {adm.assigned_level}L Coordinator
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {adm.permissions?.includes('*') ? (
                          <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                            Universal All Access (*)
                          </span>
                        ) : (
                          adm.permissions?.map(p => (
                            <span key={p} className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#041801] text-gray-700 dark:text-green-200 text-[9.5px] font-mono border border-gray-200 dark:border-[#138601]/30">
                              {p.replace('main_website.', '').replace('student_portal.', '').replace('feature:', '')}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#138601]/20">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-[#138601]" />
                  <span>Invite & Assign Administrator</span>
                </h3>
                <button onClick={() => setIsInviteModalOpen(false)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleInvite} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dr. C. O. Ibe or Engr. Adaeze"
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
                    placeholder="adviser@nacos.org.ng"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Administrative Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 font-semibold"
                    >
                      <option value="website_admin">Website Administrator</option>
                      <option value="portal_admin">Portal Administrator</option>
                      <option value="course_adviser">Course Adviser (Results & Registry)</option>
                      <option value="feature_specialist">Specialized Feature Manager</option>
                      <option value="super_admin">Super Admin (Universal Access)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Platform Scope</label>
                    <select
                      value={formData.scope}
                      onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 font-semibold"
                    >
                      <option value="main_website">Main Website</option>
                      <option value="student_portal">Student Portal</option>
                      <option value="super_admin">Universal All Platforms</option>
                    </select>
                  </div>
                </div>

                {/* Academic Level Assignment for Course Advisers */}
                {formData.role === 'course_adviser' && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-1">
                    <label className="block font-bold text-amber-900 dark:text-amber-200">
                      Academic Level Restriction (Course Adviser)
                    </label>
                    <select
                      value={formData.assigned_level}
                      onChange={(e) => setFormData({ ...formData, assigned_level: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-amber-300 dark:border-amber-700 text-xs font-semibold"
                    >
                      <option value="100">100 Level Students & Courses</option>
                      <option value="200">200 Level Students & Courses</option>
                      <option value="300">300 Level Students & Courses</option>
                      <option value="400">400 Level Students & Courses</option>
                      <option value="500">500 Level Students & Courses</option>
                      <option value="all">All Academic Levels</option>
                    </select>
                    <p className="text-[10px] text-amber-700 dark:text-amber-300">
                      Course Adviser will solely manage Results & Grading and Student Registry for this designated level.
                    </p>
                  </div>
                )}

                {/* Feature-Based Permissions Assignment */}
                <div>
                  <label className="block font-bold mb-2">Feature-Based Assignments (Granular Capabilities)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50 dark:bg-[#041801] p-3 rounded-xl border border-gray-200 dark:border-[#138601]/25">
                    {AVAILABLE_ADMIN_FEATURES.map(feat => (
                      <label key={feat.key} className="flex items-start gap-2 p-1.5 rounded hover:bg-white dark:hover:bg-white/5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.permissions.includes(feat.key)}
                          onChange={() => handleTogglePermission(feat.key)}
                          className="mt-0.5 w-3.5 h-3.5 text-[#138601] rounded"
                        />
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white block leading-tight">{feat.label}</span>
                          <span className="text-[10px] text-gray-400 block">{feat.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-[#138601]/20">
                  <button
                    type="button"
                    onClick={() => setIsInviteModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 dark:bg-white/10 dark:text-gray-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-white bg-[#138601] hover:bg-[#0f6c01] font-semibold cursor-pointer shadow-xs"
                  >
                    Save & Create Admin
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

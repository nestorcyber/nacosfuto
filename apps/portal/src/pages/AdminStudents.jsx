import React, { useState, useEffect, useMemo } from 'react';
import PortalLayout from '../components/PortalLayout';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  KeyRound, 
  Edit, 
  Eye, 
  Filter,
  GraduationCap,
  RefreshCw,
  CreditCard,
  ShieldCheck
} from 'lucide-react';
import { 
  adminGetAllStudents, 
  adminAddStudent, 
  adminUpdateStudent, 
  adminToggleStudentStatus, 
  adminResetStudentPassword 
} from '@nacos/supabase/auth';
import { 
  parseAdmissionYear, 
  calculateCurrentLevel, 
  calculateExpectedGraduation, 
  CURRENT_ACADEMIC_YEAR_START,
  getAcademicSession
} from '@nacos/config/academic';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    matricNumber: '',
    email: '',
    phone: '',
    programme: 'B.Tech Computer Science',
    department: 'Computer Science',
    faculty: 'School of Information & Communication Tech (SICT)',
    programmeDuration: 5,
    password: 'password'
  });

  const [editStudentData, setEditStudentData] = useState({});
  const [newPasswordInput, setNewPasswordInput] = useState('password');

  useEffect(() => {
    loadStudents();
    const stored = localStorage.getItem('nacos_user');
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const loadStudents = async () => {
    const list = await adminGetAllStudents();
    setStudents(list);
  };

  const showNotification = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3500);
  };

  // Real-time calculation for Add Modal
  const newStudentAcademic = useMemo(() => {
    if (!newStudent.matricNumber || newStudent.matricNumber.trim().length < 4) return null;
    const parse = parseAdmissionYear(newStudent.matricNumber, CURRENT_ACADEMIC_YEAR_START);
    if (!parse.valid) return { valid: false, error: parse.error };
    
    const duration = parseInt(newStudent.programmeDuration, 10) || 5;
    const levelInfo = calculateCurrentLevel(parse.admissionYear, CURRENT_ACADEMIC_YEAR_START, duration);
    const gradYear = calculateExpectedGraduation(parse.admissionYear, duration);
    return {
      valid: true,
      admissionYear: parse.admissionYear,
      levelString: levelInfo.levelString,
      gradYear
    };
  }, [newStudent.matricNumber, newStudent.programmeDuration]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = 
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchLevel = levelFilter === 'ALL' || s.current_level?.includes(levelFilter);
      return matchSearch && matchLevel;
    });
  }, [students, searchTerm, levelFilter]);

  // Actions
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newStudentAcademic || !newStudentAcademic.valid) {
      showNotification(newStudentAcademic?.error || 'Invalid registration number.', 'error');
      return;
    }

    const res = await adminAddStudent(newStudent);
    if (res.error) {
      showNotification(res.error.message, 'error');
    } else {
      showNotification(`Student ${newStudent.fullName} enrolled successfully!`);
      setIsAddModalOpen(false);
      setNewStudent({
        fullName: '',
        matricNumber: '',
        email: '',
        phone: '',
        programme: 'B.Tech Computer Science',
        department: 'Computer Science',
        faculty: 'School of Information & Communication Tech (SICT)',
        programmeDuration: 5,
        password: 'password'
      });
      loadStudents();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await adminUpdateStudent(editStudentData.id, editStudentData);
    if (res.error) {
      showNotification(res.error.message, 'error');
    } else {
      showNotification(`Student records updated.`);
      setIsEditModalOpen(false);
      loadStudents();
    }
  };

  const handleToggleStatus = async (student) => {
    const res = await adminToggleStudentStatus(student.id);
    if (res.error) {
      showNotification(res.error.message, 'error');
    } else {
      showNotification(`Student account ${student.is_active ? 'deactivated' : 'activated'}.`);
      loadStudents();
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    const res = await adminResetStudentPassword(selectedStudent.id, newPasswordInput);
    if (res.error) {
      showNotification(res.error.message, 'error');
    } else {
      showNotification(`Password for ${selectedStudent.full_name} reset successfully.`);
      setIsResetModalOpen(false);
      setNewPasswordInput('password');
    }
  };

  const handleAdminRegenerateId = (student) => {
    const idCardsStored = localStorage.getItem('nacos_id_cards_db');
    let idCards = [];
    if (idCardsStored) {
      try { idCards = JSON.parse(idCardsStored); } catch (e) {}
    }
    const matric = student.registration_number || student.matric;
    idCards = idCards.filter(c => c.registration_number !== matric);
    localStorage.setItem('nacos_id_cards_db', JSON.stringify(idCards));
    showNotification(`Student ID card for ${student.full_name} (${matric}) invalidated & regenerated with template 2026.1.`);
  };

  const isAdmin = currentUser?.role === 'Chapter President' || currentUser?.role === 'Admin';

  return (
    <PortalLayout>
      <div className="space-y-6">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-[#138601] dark:text-[#4bd043]" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Student Registry & Academic Level Management
              </h1>
            </div>
            <p className="text-xs text-gray-500 dark:text-green-100/70">
              Active Session: <strong className="text-gray-800 dark:text-white">{getAcademicSession(CURRENT_ACADEMIC_YEAR_START)}</strong> • Levels automatically verified by Admission Year.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 min-h-[42px] text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] rounded shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback.message && (
          <div className={`p-3 rounded text-xs font-semibold flex items-center gap-2 ${
            feedback.type === 'error' 
              ? 'bg-red-50 text-red-700 border border-red-200' 
              : 'bg-green-50 text-green-800 border border-green-200'
          }`}>
            {feedback.type === 'error' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, registration number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded border border-gray-300 dark:border-[#138601]/30 bg-white dark:bg-[#083002] text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-[#138601]"
            />
          </div>

          <div className="relative">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded border border-gray-300 dark:border-[#138601]/30 bg-white dark:bg-[#083002] text-gray-900 dark:text-white outline-none focus:border-[#138601]"
            >
              <option value="ALL">All Academic Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
              <option value="Graduated">Graduated Alumni</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-[#041801] text-gray-500 dark:text-green-200/70 border-b border-gray-200 dark:border-[#138601]/30 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Student & Reg No</th>
                <th className="py-3 px-4">Admission</th>
                <th className="py-3 px-4">Calculated Level</th>
                <th className="py-3 px-4">Programme & Duration</th>
                <th className="py-3 px-4">Graduation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-[#138601]/20">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No students match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-[#041801]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900 dark:text-white">{s.full_name}</div>
                      <div className="text-[11px] font-mono text-gray-500 dark:text-green-100/70">{s.registration_number}</div>
                      <div className="text-[10px] text-gray-400">{s.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#138601] dark:text-[#4bd043]">
                      {s.admission_year}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded font-bold text-[11px] bg-[#138601]/10 text-[#138601] dark:text-[#4bd043] border border-[#138601]/20">
                        {s.current_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{s.programme}</div>
                      <div className="text-[10px] text-gray-400">{s.programme_duration} Years Duration</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white">
                      {s.expected_graduation_year}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        s.is_active 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {s.is_active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          title="View Profile"
                          onClick={() => setSelectedStudent(s)}
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#041801] text-gray-600 dark:text-gray-300"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit Information"
                          onClick={() => {
                            setEditStudentData({ ...s });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#041801] text-blue-600 dark:text-blue-400"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Reset Password"
                          onClick={() => {
                            setSelectedStudent(s);
                            setIsResetModalOpen(true);
                          }}
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#041801] text-amber-600 dark:text-amber-400"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Regenerate ID Card"
                          onClick={() => handleAdminRegenerateId(s)}
                          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#041801] text-emerald-600 dark:text-emerald-400"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title={s.is_active ? 'Deactivate Student' : 'Activate Student'}
                          onClick={() => handleToggleStatus(s)}
                          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-[#041801] ${
                            s.is_active ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {s.is_active ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL 1: Enroll Student Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enroll New Student</h2>
              <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nestor Anyanwu"
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Registration Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024CS12345"
                    value={newStudent.matricNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, matricNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                  />
                </div>

                {/* Auto detection preview */}
                {newStudentAcademic && (
                  <div className={`p-2.5 rounded border text-[11px] ${
                    newStudentAcademic.valid ? 'bg-green-50 dark:bg-[#041801] border-green-200 dark:border-[#138601]/40 text-green-900 dark:text-green-300' : 'bg-red-50 text-red-700'
                  }`}>
                    {newStudentAcademic.valid ? (
                      <div>
                        Admission Year: <strong>{newStudentAcademic.admissionYear}</strong> • Level: <strong>{newStudentAcademic.levelString}</strong> • Graduation: <strong>{newStudentAcademic.gradYear}</strong>
                      </div>
                    ) : (
                      <span>{newStudentAcademic.error}</span>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Student Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@futo.edu.ng"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="08012345678"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Programme Duration</label>
                    <select
                      value={newStudent.programmeDuration}
                      onChange={(e) => setNewStudent({ ...newStudent, programmeDuration: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                    >
                      <option value={4}>4 Years (e.g. Software Eng)</option>
                      <option value={5}>5 Years (B.Tech Computer Science)</option>
                      <option value={6}>6 Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Initial Password</label>
                    <input
                      type="text"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-100 dark:bg-[#041801] text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-white bg-[#138601] hover:bg-[#0f6c01] font-semibold"
                  >
                    Save & Enroll
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: Edit Student Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-2xl space-y-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Student Records</h2>
              <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={editStudentData.full_name || ''}
                    onChange={(e) => setEditStudentData({ ...editStudentData, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={editStudentData.registration_number || ''}
                    onChange={(e) => setEditStudentData({ ...editStudentData, registration_number: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Programme Duration</label>
                    <select
                      value={editStudentData.programme_duration || 5}
                      onChange={(e) => setEditStudentData({ ...editStudentData, programme_duration: parseInt(e.target.value, 10) })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                    >
                      <option value={4}>4 Years</option>
                      <option value={5}>5 Years</option>
                      <option value={6}>6 Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">Programme</label>
                    <input
                      type="text"
                      value={editStudentData.programme || ''}
                      onChange={(e) => setEditStudentData({ ...editStudentData, programme: e.target.value })}
                      className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-100 dark:bg-[#041801] text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-white bg-[#138601] hover:bg-[#0f6c01] font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: Reset Password Modal */}
        {isResetModalOpen && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-sm w-full p-6 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-2xl space-y-4">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Reset Student Password</h2>
              <p className="text-xs text-gray-600 dark:text-green-100/80">
                Enter a new temporary password for <strong>{selectedStudent.full_name}</strong> ({selectedStudent.registration_number}).
              </p>
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 dark:text-green-200 font-semibold mb-1">New Password</label>
                  <input
                    type="text"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-gray-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsResetModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-100 dark:bg-[#041801] text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-white bg-[#138601] hover:bg-[#0f6c01] font-semibold"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: Student Details Preview */}
        {selectedStudent && !isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#138601]/20 pb-3">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Academic File: {selectedStudent.full_name}</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Reg. Number:</span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">{selectedStudent.registration_number}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Admission Year:</span>
                  <span className="font-bold text-[#138601] dark:text-[#4bd043]">{selectedStudent.admission_year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Current Academic Level:</span>
                  <span className="font-bold text-[#138601] dark:text-[#4bd043]">{selectedStudent.current_level}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Programme Duration:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent.programme_duration} Years</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Expected Graduation:</span>
                  <span className="font-bold text-gray-900 dark:text-white">{selectedStudent.expected_graduation_year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Official Email:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{selectedStudent.email}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#138601]/10">
                  <span className="text-gray-500">Status:</span>
                  <span className={selectedStudent.is_active ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {selectedStudent.is_active ? 'Active Enrolled' : 'Deactivated'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 rounded text-xs font-semibold bg-gray-100 dark:bg-[#041801] text-gray-800 dark:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default AdminStudents;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download,
  Search,
  FileText,
  ExternalLink,
  ChevronDown,
  Filter,
  Eye,
  Video,
  Image as ImageIcon,
  Folder,
  BookOpen,
  HelpCircle,
  FileArchive,
  Calendar,
  Sparkles,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Share2,
  Lock,
  Layers,
  FileCode
} from 'lucide-react';
import PortalLayout from '../components/PortalLayout';
import { 
  fetchResources, 
  fetchResourceCategories, 
  recordResourceDownload, 
  recordResourceView,
  storageService 
} from '@nacos/supabase';

// Static Curriculum Reference Catalog (For Course syllabus & registered module reference)
const CURRICULUM_COURSES = [
  // 100 Level
  { code: 'CSC 101', title: 'Introduction to Computing Systems', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 7, pastQuestions: 6, levelNumber: 100, semesterNumber: 1 },
  { code: 'MTH 101', title: 'Elementary Mathematics I (Algebra & Trig)', units: 3, lecturer: 'Dr. E. O. Opara', notesCount: 5, pastQuestions: 8, levelNumber: 100, semesterNumber: 1 },
  { code: 'PHY 101', title: 'General Physics I (Mechanics)', units: 3, lecturer: 'Prof. B. C. Eze', notesCount: 6, pastQuestions: 7, levelNumber: 100, semesterNumber: 1 },
  { code: 'CSC 102', title: 'Introduction to Problem Solving & Programming', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 8, pastQuestions: 7, levelNumber: 100, semesterNumber: 2 },
  { code: 'MTH 102', title: 'Elementary Mathematics II (Calculus)', units: 3, lecturer: 'Dr. E. O. Opara', notesCount: 6, pastQuestions: 9, levelNumber: 100, semesterNumber: 2 },
  // 200 Level
  { code: 'CSC 201', title: 'Computer Programming I (C++)', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 7, pastQuestions: 8, levelNumber: 200, semesterNumber: 1 },
  { code: 'CSC 203', title: 'Discrete Structures', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 6, pastQuestions: 6, levelNumber: 200, semesterNumber: 1 },
  { code: 'CSC 202', title: 'Computer Programming II (Java)', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 8, pastQuestions: 8, levelNumber: 200, semesterNumber: 2 },
  // 300 Level
  { code: 'CSC 301', title: 'Structured Programming (C++)', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 6, pastQuestions: 5, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 303', title: 'Data Structures & Algorithms', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 8, pastQuestions: 7, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 305', title: 'Operating Systems & Architecture', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 5, pastQuestions: 6, levelNumber: 300, semesterNumber: 1 },
  { code: 'CSC 308', title: 'Web Technologies & Internet Programming', units: 3, lecturer: 'Tech Director (NACOS)', notesCount: 8, pastQuestions: 6, levelNumber: 300, semesterNumber: 2 },
  // 400 Level
  { code: 'CSC 403', title: 'Computer Networks & Security', units: 3, lecturer: 'Dr. G. A. Chukwudebe', notesCount: 7, pastQuestions: 7, levelNumber: 400, semesterNumber: 1 },
  { code: 'CSC 407', title: 'Computer Graphics & Visualization', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 6, pastQuestions: 5, levelNumber: 400, semesterNumber: 1 },
  // 500 Level
  { code: 'CSC 501', title: 'Artificial Intelligence & Expert Systems', units: 3, lecturer: 'Dr. (Mrs) N. C. Daniel', notesCount: 8, pastQuestions: 7, levelNumber: 500, semesterNumber: 1 },
  { code: 'CSC 505', title: 'Cryptography & Information Security', units: 3, lecturer: 'Prof. F. E. Onuodu', notesCount: 7, pastQuestions: 6, levelNumber: 500, semesterNumber: 1 },
  { code: 'CSC 509', title: 'Machine Learning & Neural Networks', units: 3, lecturer: 'Dr. C. N. Nwokorie', notesCount: 8, pastQuestions: 7, levelNumber: 500, semesterNumber: 1 }
];

// Fallback seed resources if remote DB is freshly initialized
const SEED_FALLBACK_RESOURCES = [
  {
    id: 'res-pq-csc201',
    title: 'CSC 201 Comprehensive Examination & Mid-Term Solutions (2022–2024)',
    slug: 'csc-201-past-questions-bundle',
    description: 'Complete compilation of past semester examination questions, test solutions, and code traces for C++ Programming I.',
    category_id: 'cat-past-questions',
    category: { name: 'Past Questions', slug: 'past-questions', icon: 'HelpCircle' },
    course_code: 'CSC 201',
    level: 200,
    session: '2024/2025',
    resource_type: 'past_question',
    file_name: 'CSC201_Comprehensive_Pack.pdf',
    file_extension: 'pdf',
    mime_type: 'application/pdf',
    file_size: 3774873, // 3.6 MB
    storage_provider: 'cloudflare_r2',
    storage_key: 'resources/res-pq-csc201/original/CSC201_Comprehensive_Pack.pdf',
    thumbnail_key: null,
    download_count: 490,
    created_at: '2026-08-20T10:00:00Z',
    is_public: true,
    is_active: true
  },
  {
    id: 'res-cm-csc303',
    title: 'Data Structures & Algorithms in C++ Master Lecture Notes',
    slug: 'csc-303-dsa-lecture-notes',
    description: 'Detailed lecture slides and code implementations covering Trees, Graphs, Sorting Algorithms, Dynamic Programming, and Big-O Complexity.',
    category_id: 'cat-course-materials',
    category: { name: 'Course Materials', slug: 'course-materials', icon: 'BookOpen' },
    course_code: 'CSC 303',
    level: 300,
    session: '2024/2025',
    resource_type: 'document',
    file_name: 'CSC303_DSA_Lecture_Master.pdf',
    file_extension: 'pdf',
    mime_type: 'application/pdf',
    file_size: 4309811, // 4.1 MB
    storage_provider: 'cloudflare_r2',
    storage_key: 'resources/res-cm-csc303/original/CSC303_DSA_Lecture_Master.pdf',
    thumbnail_key: null,
    download_count: 512,
    created_at: '2026-08-22T14:30:00Z',
    is_public: true,
    is_active: true
  },
  {
    id: 'res-vid-webdev',
    title: 'Modern Web Development & React Framework Video Tutorial (Part 1)',
    slug: 'modern-web-development-react-tutorial',
    description: 'Video workshop covering modern component-driven frontends, state management, REST APIs, and portal architecture.',
    category_id: 'cat-videos',
    category: { name: 'Videos', slug: 'videos', icon: 'Video' },
    course_code: 'CSC 308',
    level: 300,
    session: '2024/2025',
    resource_type: 'video',
    file_name: 'React_Workshop_Session1.mp4',
    file_extension: 'mp4',
    mime_type: 'video/mp4',
    file_size: 48234496, // 46 MB
    storage_provider: 'cloudflare_r2',
    storage_key: 'resources/res-vid-webdev/original/React_Workshop_Session1.mp4',
    thumbnail_key: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    duration_seconds: 2400,
    download_count: 275,
    created_at: '2026-08-25T11:00:00Z',
    is_public: true,
    is_active: true
  },
  {
    id: 'res-hb-student-handbook',
    title: 'NACOS FUTO Official Departmental Student Handbook (Revised Edition)',
    slug: 'nacos-futo-student-handbook',
    description: 'Departmental academic curriculum, grading systems, code of conduct, course prerequisites, and faculty advisor directory.',
    category_id: 'cat-handbooks',
    category: { name: 'Handbooks', slug: 'handbooks', icon: 'FileText' },
    course_code: null,
    level: null,
    session: '2024/2025',
    resource_type: 'document',
    file_name: 'NACOS_FUTO_Departmental_Handbook.pdf',
    file_extension: 'pdf',
    mime_type: 'application/pdf',
    file_size: 5872025, // 5.6 MB
    storage_provider: 'cloudflare_r2',
    storage_key: 'resources/res-hb-student-handbook/original/NACOS_FUTO_Departmental_Handbook.pdf',
    download_count: 890,
    created_at: '2026-08-10T09:00:00Z',
    is_public: true,
    is_active: true
  },
  {
    id: 'res-pq-mth311',
    title: 'MTH 311 Numerical Methods Worked Solutions & Examination Compendium',
    slug: 'mth-311-numerical-methods-solutions',
    description: 'Step-by-step solutions to Newton-Raphson, Runge-Kutta, Gaussian elimination, and numerical integration exam questions.',
    category_id: 'cat-past-questions',
    category: { name: 'Past Questions', slug: 'past-questions', icon: 'HelpCircle' },
    course_code: 'MTH 311',
    level: 300,
    session: '2023/2024',
    resource_type: 'past_question',
    file_name: 'MTH311_Worked_Solutions.pdf',
    file_extension: 'pdf',
    mime_type: 'application/pdf',
    file_size: 5452595, // 5.2 MB
    storage_provider: 'cloudflare_r2',
    storage_key: 'resources/res-pq-mth311/original/MTH311_Worked_Solutions.pdf',
    download_count: 620,
    created_at: '2026-08-15T16:00:00Z',
    is_public: true,
    is_active: true
  },
  {
    id: 'res-tut-ai-ml',
    title: 'CSC 501 Artificial Intelligence & Deep Neural Networks Lab Workbook',
    slug: 'csc-501-ai-ml-workbook',
    description: 'PyTorch and TensorFlow practical exercises, dataset preprocessing guides, and model evaluation techniques.',
    category_id: 'cat-tutorials',
    category: { name: 'Tutorials', slug: 'tutorials', icon: 'Sparkles' },
    course_code: 'CSC 501',
    level: 500,
    session: '2024/2025',
    resource_type: 'document',
    file_name: 'CSC501_AI_NeuralNetworks_Lab.pdf',
    file_extension: 'pdf',
    mime_type: 'application/pdf',
    file_size: 5033164, // 4.8 MB
    storage_provider: 'cloudflare_r2',
    storage_key: 'resources/res-tut-ai-ml/original/CSC501_AI_NeuralNetworks_Lab.pdf',
    download_count: 310,
    created_at: '2026-08-28T12:00:00Z',
    is_public: true,
    is_active: true
  }
];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Active User State
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return {};
  });

  // Calculate Student Level
  const currentLevel = useMemo(() => {
    const levelStr = (user.level || '').toString();
    const match = levelStr.match(/(\d{3})/);
    if (match) return parseInt(match[1], 10);
    if (levelStr.toLowerCase().includes('alumni') || levelStr.toLowerCase().includes('graduated')) return 500;
    if (user.role && (user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('president'))) return 500;
    if (user.admission_year) {
      const num = 2026 - parseInt(user.admission_year, 10) + 1;
      if (num >= 5) return 500;
      if (num <= 1) return 100;
      return num * 100;
    }
    return 300;
  }, [user]);

  // Main UI Mode Switcher ('hub' = dynamic resource files, 'curriculum' = catalog syllabus)
  const [activeView, setActiveView] = useState('hub');

  // Filter States (initialized from URL search params if present)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(() => searchParams.get('category') || 'all');
  const [selectedLevel, setSelectedLevel] = useState(() => searchParams.get('level') || 'all');
  const [selectedCourseCode, setSelectedCourseCode] = useState(() => searchParams.get('course') || 'all');
  const [selectedSession, setSelectedSession] = useState(() => searchParams.get('session') || 'all');
  const [selectedResourceType, setSelectedResourceType] = useState(() => searchParams.get('type') || 'all');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'newest');
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Data States
  const [categories, setCategories] = useState([]);
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [downloadingId, setDownloadingId] = useState(null);

  // Modal / Preview States
  const [activePreviewResource, setActivePreviewResource] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Sync Filters to URL Query Parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategorySlug && selectedCategorySlug !== 'all') params.set('category', selectedCategorySlug);
    if (selectedLevel && selectedLevel !== 'all') params.set('level', selectedLevel);
    if (selectedCourseCode && selectedCourseCode !== 'all') params.set('course', selectedCourseCode);
    if (selectedSession && selectedSession !== 'all') params.set('session', selectedSession);
    if (selectedResourceType && selectedResourceType !== 'all') params.set('type', selectedResourceType);
    if (sortBy && sortBy !== 'newest') params.set('sort', sortBy);
    if (debouncedSearch) params.set('search', debouncedSearch);

    setSearchParams(params, { replace: true });
  }, [selectedCategorySlug, selectedLevel, selectedCourseCode, selectedSession, selectedResourceType, sortBy, debouncedSearch, setSearchParams]);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      const res = await fetchResourceCategories();
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      } else {
        // Fallback default categories
        setCategories([
          { id: 'all', name: 'All Resources', slug: 'all', icon: 'Layers' },
          { id: 'cat-course-materials', name: 'Course Materials', slug: 'course-materials', icon: 'BookOpen' },
          { id: 'cat-past-questions', name: 'Past Questions', slug: 'past-questions', icon: 'HelpCircle' },
          { id: 'cat-tutorials', name: 'Tutorials', slug: 'tutorials', icon: 'Sparkles' },
          { id: 'cat-handbooks', name: 'Handbooks', slug: 'handbooks', icon: 'FileText' },
          { id: 'cat-videos', name: 'Videos', slug: 'videos', icon: 'Video' },
          { id: 'cat-forms', name: 'Forms', slug: 'forms', icon: 'FileCode' },
          { id: 'cat-events', name: 'Events', slug: 'events', icon: 'Calendar' }
        ]);
      }
    }
    loadCategories();
  }, []);

  // Fetch Resources from Database / Fallback Seed
  const loadResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchResources({
        categorySlug: selectedCategorySlug,
        level: selectedLevel,
        courseCode: selectedCourseCode,
        session: selectedSession,
        resourceType: selectedResourceType,
        search: debouncedSearch,
        sort: sortBy,
        page: 1,
        limit: 50
      });

      if (res.data && res.data.length > 0) {
        setResources(res.data);
        setTotalCount(res.total);
      } else {
        // Filter fallback seed items client-side if DB returns empty
        let filteredSeed = SEED_FALLBACK_RESOURCES.filter(item => {
          if (selectedCategorySlug !== 'all' && item.category?.slug !== selectedCategorySlug) return false;
          if (selectedLevel !== 'all' && item.level && item.level.toString() !== selectedLevel) return false;
          if (selectedCourseCode !== 'all' && item.course_code && !item.course_code.includes(selectedCourseCode)) return false;
          if (selectedSession !== 'all' && item.session !== selectedSession) return false;
          if (selectedResourceType !== 'all' && item.resource_type !== selectedResourceType) return false;
          if (debouncedSearch) {
            const q = debouncedSearch.toLowerCase();
            const matchTitle = item.title.toLowerCase().includes(q);
            const matchDesc = item.description?.toLowerCase().includes(q);
            const matchCode = item.course_code?.toLowerCase().includes(q);
            if (!matchTitle && !matchDesc && !matchCode) return false;
          }
          return true;
        });

        // Sort seed items
        if (sortBy === 'popular') {
          filteredSeed.sort((a, b) => b.download_count - a.download_count);
        } else if (sortBy === 'title_asc') {
          filteredSeed.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'oldest') {
          filteredSeed.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        setResources(filteredSeed);
        setTotalCount(filteredSeed.length);
      }
    } catch (err) {
      console.warn('Resource hub fetch fallback:', err);
      setResources(SEED_FALLBACK_RESOURCES);
      setTotalCount(SEED_FALLBACK_RESOURCES.length);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategorySlug, selectedLevel, selectedCourseCode, selectedSession, selectedResourceType, debouncedSearch, sortBy]);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trigger Secure Download with Atomic DB Increment
  const handleDownload = async (resource) => {
    setDownloadingId(resource.id);
    try {
      // 1. Record download atomically in database via RPC
      recordResourceDownload(resource.id, {
        userId: user.id || null,
        userAgent: navigator.userAgent
      }).catch(err => console.warn(err));

      // Optimistically increment local count
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, download_count: (r.download_count || 0) + 1 } : r));

      // 2. Obtain download URL (presigned if Cloudflare R2 or direct public)
      let url = await storageService.getDownloadUrl(resource.storage_key, {
        downloadFileName: resource.file_name || `${resource.title}.${resource.file_extension || 'pdf'}`
      });

      if (!url) {
        url = `/downloads/${resource.file_name || 'document.pdf'}`;
      }

      // 3. Initiate browser download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.file_name || `${resource.slug}.${resource.file_extension || 'pdf'}`);
      link.target = '_blank';
      link.rel = 'noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Downloading "${resource.title}"...`);
    } catch (err) {
      showToast('Download failed. Please try again.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  // Open Preview Modal
  const handleOpenPreview = async (resource) => {
    setActivePreviewResource(resource);
    setIsLoadingPreview(true);
    setPreviewUrl(null);

    // Record view in analytics
    recordResourceView(resource.id, { userId: user.id || null }).catch(err => console.warn(err));

    try {
      const url = await storageService.getPreviewUrl(resource.storage_key);
      setPreviewUrl(url || resource.storage_key);
    } catch (e) {
      setPreviewUrl(resource.storage_key);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategorySlug('all');
    setSelectedLevel('all');
    setSelectedCourseCode('all');
    setSelectedSession('all');
    setSelectedResourceType('all');
    setSortBy('newest');
    setSearchTerm('');
  };

  // Helper formatting
  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return 'Unknown size';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getFileBadge = (ext, type) => {
    const clean = (ext || type || 'pdf').toLowerCase();
    if (clean.includes('pdf')) return { label: 'PDF Document', color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', icon: FileText };
    if (clean.includes('mp4') || clean.includes('video')) return { label: 'MP4 Video', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', icon: Video };
    if (clean.includes('doc') || clean.includes('word')) return { label: 'DOCX Document', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', icon: FileText };
    if (clean.includes('zip') || clean.includes('archive')) return { label: 'ZIP Archive', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: FileArchive };
    if (clean.includes('jpg') || clean.includes('png') || clean.includes('image')) return { label: 'Image', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', icon: ImageIcon };
    return { label: ext?.toUpperCase() || 'FILE', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-300 border-gray-500/20', icon: FileText };
  };

  // Filtered curriculum for the catalog tab
  const filteredCurriculum = useMemo(() => {
    return CURRICULUM_COURSES.filter(c => {
      if (selectedLevel !== 'all' && c.levelNumber.toString() !== selectedLevel) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.lecturer.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedLevel, searchTerm]);

  return (
    <PortalLayout>
      <div className="space-y-6 font-sans">
        
        {/* Toast notification banner */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 p-3.5 rounded bg-white dark:bg-[#083002] border border-emerald-500/40 text-gray-900 dark:text-white shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
            {toastMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
            )}
            <span className="text-xs font-semibold">{toastMessage.text}</span>
          </div>
        )}

        {/* ─── Hero Header & Search Bar ─── */}
        <div className="p-6 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded bg-green-500/10 text-[#138601] dark:text-[#4bd043] border border-[#138601]/20">
                <BookOpen className="w-4 h-4" />
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Student Resource Hub
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
                Cloud R2 Storage
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-green-200/80 max-w-2xl font-normal leading-relaxed">
              Discover official course materials, past examination solutions, lecture slides, video tutorials, handbooks, and departmental forms.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 dark:text-green-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course, title, topic or lecturer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-green-200/50 focus:outline-none focus:ring-1 focus:ring-[#138601] shadow-xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ─── Top Switcher: Resource Hub Files vs Curriculum Syllabus ─── */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#138601]/25 pb-2">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setActiveView('hub')}
              className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                activeView === 'hub'
                  ? 'bg-[#138601] text-white shadow-xs'
                  : 'text-gray-600 dark:text-green-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#f1f3f5] dark:hover:bg-[#083002]'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Resource Files & Archives ({totalCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('curriculum')}
              className={`px-4 py-2 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                activeView === 'curriculum'
                  ? 'bg-[#138601] text-white shadow-xs'
                  : 'text-gray-600 dark:text-green-200 hover:text-gray-900 dark:hover:text-white hover:bg-[#f1f3f5] dark:hover:bg-[#083002]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Departmental Syllabus ({filteredCurriculum.length})</span>
            </button>
          </div>

          <span className="hidden sm:inline text-xs text-gray-400 dark:text-green-200/60">
            Student Level: <strong className="text-gray-900 dark:text-white font-semibold">{currentLevel}L</strong>
          </span>
        </div>

        {/* ─── Category Tabs Pill Bar ─── */}
        {activeView === 'hub' && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategorySlug('all')}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategorySlug === 'all'
                  ? 'bg-[#138601] text-white border-[#138601] shadow-xs'
                  : 'bg-white dark:bg-[#083002] text-gray-700 dark:text-green-200 border-gray-200 dark:border-[#138601]/30 hover:border-[#138601]/60'
              }`}
            >
              All Categories
            </button>
            {categories.filter(c => c.slug !== 'all').map((cat) => (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  selectedCategorySlug === cat.slug
                    ? 'bg-[#138601] text-white border-[#138601] shadow-xs'
                    : 'bg-white dark:bg-[#083002] text-gray-700 dark:text-green-200 border-gray-200 dark:border-[#138601]/30 hover:border-[#138601]/60'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* ─── Filter & Sorting Control Strip ─── */}
        <div className="p-4 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Filter */}
            <div className="flex items-center gap-1.5">
              <label className="text-xs font-semibold text-gray-600 dark:text-green-200">Level:</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
                <option value="500">500 Level</option>
              </select>
            </div>

            {/* Resource Type Filter */}
            {activeView === 'hub' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-green-200">Type:</label>
                <select
                  value={selectedResourceType}
                  onChange={(e) => setSelectedResourceType(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
                >
                  <option value="all">All File Types</option>
                  <option value="document">PDF & Documents</option>
                  <option value="past_question">Past Questions</option>
                  <option value="video">Video Tutorials</option>
                  <option value="image">Images & Graphics</option>
                  <option value="archive">ZIP / Code Archives</option>
                </select>
              </div>
            )}

            {/* Academic Session Filter */}
            {activeView === 'hub' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-green-200">Session:</label>
                <select
                  value={selectedSession}
                  onChange={(e) => setSelectedSession(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
                >
                  <option value="all">All Academic Sessions</option>
                  <option value="2025/2026">2025/2026 (Current)</option>
                  <option value="2024/2025">2024/2025</option>
                  <option value="2023/2024">2023/2024</option>
                  <option value="2022/2023">2022/2023</option>
                </select>
              </div>
            )}

            {/* Sort Filter */}
            {activeView === 'hub' && (
              <div className="flex items-center gap-1.5">
                <label className="text-xs font-semibold text-gray-600 dark:text-green-200">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] cursor-pointer"
                >
                  <option value="newest">Newest Uploads</option>
                  <option value="popular">Most Downloaded</option>
                  <option value="title_asc">Title (A – Z)</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            )}
          </div>

          {/* Reset Filters */}
          <div className="flex items-center gap-3">
            {(selectedCategorySlug !== 'all' || selectedLevel !== 'all' || selectedResourceType !== 'all' || selectedSession !== 'all' || searchTerm) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-[#138601] dark:text-[#4bd043] font-semibold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
            <span className="text-xs text-gray-500 dark:text-green-200/70">
              Showing <strong className="text-gray-900 dark:text-white">{activeView === 'hub' ? resources.length : filteredCurriculum.length}</strong> items
            </span>
          </div>
        </div>

        {/* ─── VIEW 1: DYNAMIC RESOURCE HUB GRID ─── */}
        {activeView === 'hub' && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="p-12 text-center rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 space-y-3 shadow-xs">
                <Folder className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">No matching resources found</h3>
                <p className="text-xs text-gray-500 dark:text-green-200/70 max-w-sm mx-auto">
                  We couldn't find any student materials matching your active search and filter criteria.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.map((item) => {
                  const badge = getFileBadge(item.file_extension, item.resource_type);
                  const Icon = badge.icon;
                  const isVideo = item.resource_type === 'video' || item.file_extension === 'mp4';

                  return (
                    <div
                      key={item.id}
                      className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#138601] transition-all flex flex-col justify-between space-y-4 shadow-xs group"
                    >
                      {/* Top Badges & Course code */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.course_code && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-50 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
                                {item.course_code}
                              </span>
                            )}
                            {item.level && (
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-[#041801] text-gray-600 dark:text-green-200">
                                {item.level}L
                              </span>
                            )}
                            <span className="text-[10px] font-medium text-gray-500 dark:text-green-200/70">
                              {item.session || '2024/2025'}
                            </span>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${badge.color}`}>
                            <Icon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-green-200/80 mt-1.5 line-clamp-2 font-normal leading-relaxed">
                            {item.description || 'Departmental resource material uploaded for computer science undergraduates.'}
                          </p>
                        </div>
                      </div>

                      {/* Video Thumbnail (if present) */}
                      {isVideo && item.thumbnail_key && (
                        <div 
                          onClick={() => handleOpenPreview(item)}
                          className="relative aspect-video rounded overflow-hidden bg-black/80 cursor-pointer group/thumb border border-gray-200 dark:border-[#138601]/20"
                        >
                          <img 
                            src={item.thumbnail_key} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#138601] text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                              <Play className="w-5 h-5 ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Strip: Metadata & Action Buttons */}
                      <div className="pt-3 border-t border-gray-100 dark:border-[#138601]/20 space-y-3">
                        <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-green-200/70 font-mono">
                          <span>{formatFileSize(item.file_size)}</span>
                          <span>{item.download_count || 0} downloads</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(item)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-[#138601]/20 text-gray-700 dark:text-green-200 border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            disabled={downloadingId === item.id}
                            onClick={() => handleDownload(item)}
                            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{downloadingId === item.id ? 'Loading...' : 'Download'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ─── VIEW 2: CURRICULUM & SYLLABUS DIRECTORY ─── */}
        {activeView === 'curriculum' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCurriculum.map((course, idx) => (
              <div
                key={idx}
                className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200/80 dark:border-[#138601]/30 hover:border-[#138601] dark:hover:border-[#138601] transition-all space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{course.code}</span>
                    <span className="text-[10px] font-medium bg-[#f1f3f5] dark:bg-[#041801] text-gray-600 dark:text-green-200 px-2 py-0.5 rounded">
                      {course.levelNumber}L • Sem {course.semesterNumber}
                    </span>
                  </div>
                  <span className="text-xs font-semibold bg-green-50 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] px-2.5 py-0.5 rounded border border-[#138601]/30">
                    {course.units} Credit Units
                  </span>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-green-200/80 mt-0.5 font-normal">Lecturer: {course.lecturer}</p>
                </div>

                <div className="pt-2.5 border-t border-gray-100 dark:border-[#138601]/20 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-green-200/70 font-normal">{course.notesCount} lecture modules • {course.pastQuestions} past exam packs</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveView('hub');
                      setSelectedCourseCode(course.code);
                      setSearchTerm(course.code);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#138601] dark:text-[#4bd043] hover:underline cursor-pointer"
                  >
                    <span>View Hub Files</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── RESOURCE PREVIEW MODAL (PDF Viewer, Video Player, Image, Meta) ─── */}
        {activePreviewResource && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#138601]/25 flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {activePreviewResource.course_code && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-50 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
                        {activePreviewResource.course_code}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                      {activePreviewResource.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-green-200/70 font-mono mt-0.5 truncate">
                    {activePreviewResource.file_name} • {formatFileSize(activePreviewResource.file_size)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownload(activePreviewResource)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePreviewResource(null);
                      setPreviewUrl(null);
                    }}
                    className="p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#041801] transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {isLoadingPreview ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="w-8 h-8 border-3 border-[#138601] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-gray-500 dark:text-green-200/70 font-medium">Generating secure resource preview...</p>
                  </div>
                ) : (
                  <>
                    {/* PDF Viewer */}
                    {(activePreviewResource.file_extension === 'pdf' || activePreviewResource.mime_type === 'application/pdf') && (
                      <div className="w-full h-[65vh] rounded border border-gray-200 dark:border-[#138601]/30 bg-gray-100 dark:bg-[#041801] overflow-hidden">
                        <iframe
                          src={previewUrl ? `${previewUrl}#toolbar=0` : ''}
                          title={activePreviewResource.title}
                          className="w-full h-full border-0"
                        />
                      </div>
                    )}

                    {/* HTML5 Streaming Video Player */}
                    {(activePreviewResource.resource_type === 'video' || activePreviewResource.file_extension === 'mp4') && (
                      <div className="w-full rounded border border-gray-200 dark:border-[#138601]/30 bg-black overflow-hidden aspect-video flex items-center justify-center">
                        <video
                          src={previewUrl}
                          controls
                          controlsList="nodownload"
                          preload="metadata"
                          className="w-full h-full max-h-[60vh] object-contain"
                        >
                          Your browser does not support HTML5 video streaming.
                        </video>
                      </div>
                    )}

                    {/* Image Viewer */}
                    {(activePreviewResource.resource_type === 'image' || ['jpg', 'jpeg', 'png', 'webp'].includes(activePreviewResource.file_extension)) && (
                      <div className="w-full rounded border border-gray-200 dark:border-[#138601]/30 bg-[#041801] p-4 flex items-center justify-center min-h-[300px]">
                        <img
                          src={previewUrl}
                          alt={activePreviewResource.title}
                          className="max-h-[60vh] max-w-full object-contain rounded"
                        />
                      </div>
                    )}

                    {/* Unsupported Preview Format (Word / Excel / ZIP) */}
                    {!['pdf', 'mp4', 'jpg', 'jpeg', 'png', 'webp'].includes(activePreviewResource.file_extension) && (
                      <div className="p-8 rounded border border-gray-200 dark:border-[#138601]/30 bg-gray-50 dark:bg-[#041801] text-center space-y-3">
                        <FileText className="w-12 h-12 text-[#138601] dark:text-[#4bd043] mx-auto" />
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white">Document Preview Not Supported</h4>
                        <p className="text-xs text-gray-500 dark:text-green-200/70 max-w-md mx-auto">
                          This file ({activePreviewResource.file_name}) cannot be rendered directly in the web browser. Click download below to view it locally.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDownload(activePreviewResource)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download {activePreviewResource.file_extension?.toUpperCase()} File</span>
                        </button>
                      </div>
                    )}

                    {/* Resource Description Details */}
                    <div className="p-4 rounded bg-gray-50 dark:bg-[#041801] border border-gray-200/80 dark:border-[#138601]/20 space-y-1.5 text-xs">
                      <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px]">Resource Details</span>
                      <p className="text-gray-600 dark:text-green-200/80 leading-relaxed font-normal">
                        {activePreviewResource.description || 'No additional description provided for this academic resource.'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalLayout>
  );
};

export default Courses;

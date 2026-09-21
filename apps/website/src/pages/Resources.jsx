import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Navbar from '../components/Nav/Navbar';
import Footer from '../components/Footer';
import { 
  FiBook, 
  FiFileText, 
  FiVideo, 
  FiExternalLink, 
  FiSearch, 
  FiRefreshCw, 
  FiDownload, 
  FiEye, 
  FiLock, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiX, 
  FiPlay, 
  FiFolder, 
  FiLayers, 
  FiUser, 
  FiArrowRight 
} from 'react-icons/fi';
import { 
  fetchResources, 
  fetchResourceCategories, 
  recordResourceDownload, 
  recordResourceView,
  storageService 
} from '@nacos/supabase';
import { getAppUrls } from '@nacos/config/urls';

// Fallback seed resources for initial state or offline database
const FALLBACK_RESOURCES = [
  { 
    id: 'res-1', 
    title: 'Introduction to Problem Solving & C Programming Lecture Compendium', 
    course_code: 'CSC 101', 
    course_title: 'Introduction to Computing Systems',
    level: 100, 
    semester: 'First Semester', 
    resource_type: 'document',
    category: { name: 'Handouts', slug: 'handouts' },
    file_name: 'CSC101_Lecture_Compendium.pdf',
    file_extension: 'pdf',
    file_size: 4404019, // 4.2 MB
    download_count: 640,
    storage_key: 'nacos/resources/res-1/CSC101_Lecture_Compendium.pdf',
    author: 'Dr. C. C. Nwokorie',
    description: 'Foundational programming concepts, flowcharting, pseudocode, memory registers, and C syntax breakdown.'
  },
  { 
    id: 'res-2', 
    title: 'Introduction to Computer Science & Computing Systems Manual', 
    course_code: 'CSC 102', 
    course_title: 'Introduction to Problem Solving & Programming',
    level: 100, 
    semester: 'Second Semester', 
    resource_type: 'document',
    category: { name: 'Books', slug: 'books' },
    file_name: 'CSC102_Systems_Handbook.pdf',
    file_extension: 'pdf',
    file_size: 5872025, // 5.6 MB
    download_count: 512,
    storage_key: 'nacos/resources/res-2/CSC102_Systems_Handbook.pdf',
    author: 'Prof. G. A. Chukwudebe',
    description: 'Evolution of computing systems, computer hardware architecture, operating software, and networking basics.'
  },
  { 
    id: 'res-3', 
    title: 'Data Structures and Algorithms in C++ & Python Handbook', 
    course_code: 'CSC 201', 
    course_title: 'Computer Programming I (C++)',
    level: 200, 
    semester: 'First Semester', 
    resource_type: 'document',
    category: { name: 'Books', slug: 'books' },
    file_name: 'CSC201_DSA_Handbook.pdf',
    file_extension: 'pdf',
    file_size: 6186598, // 5.9 MB
    download_count: 820,
    storage_key: 'nacos/resources/res-3/CSC201_DSA_Handbook.pdf',
    author: 'Prof. J. E. Stanley',
    description: 'Arrays, linked lists, stacks, queues, binary search trees, graph traversals, and asymptotic Big-O analysis.'
  },
  { 
    id: 'res-4', 
    title: 'Object-Oriented Programming with C++ & Java Practice Lab', 
    course_code: 'CSC 202', 
    course_title: 'Computer Programming II (Java)',
    level: 200, 
    semester: 'Second Semester', 
    resource_type: 'document',
    category: { name: 'Handouts', slug: 'handouts' },
    file_name: 'CSC202_OOP_Lab_Manual.pdf',
    file_extension: 'pdf',
    file_size: 3460300, // 3.3 MB
    download_count: 730,
    storage_key: 'nacos/resources/res-4/CSC202_OOP_Lab_Manual.pdf',
    author: 'Dr. O. C. Aguboshim',
    description: 'Encapsulation, inheritance hierarchies, polymorphism, abstract classes, interfaces, and exception handling.'
  },
  { 
    id: 'res-5', 
    title: 'Discrete Structures & Logic Architecture Video Masterclass', 
    course_code: 'CSC 203', 
    course_title: 'Discrete Structures',
    level: 200, 
    semester: 'First Semester', 
    resource_type: 'video',
    category: { name: 'Videos', slug: 'videos' },
    file_name: 'CSC203_Discrete_Structures_Part1.mp4',
    file_extension: 'mp4',
    file_size: 52428800, // 50 MB
    download_count: 450,
    storage_key: 'nacos/resources/res-5/CSC203_Discrete_Structures_Part1.mp4',
    thumbnail_storage_key: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    author: 'Prof. F. E. Onuodu',
    description: 'Comprehensive video walk-through covering propositional logic, set theory, graph theory, and proof methods.'
  },
  { 
    id: 'res-6', 
    title: 'Operating Systems Principles, Concurrency & Scheduling', 
    course_code: 'CSC 301', 
    course_title: 'Structured Programming (C++)',
    level: 300, 
    semester: 'First Semester', 
    resource_type: 'document',
    category: { name: 'Handouts', slug: 'handouts' },
    file_name: 'CSC301_OS_Principles.pdf',
    file_extension: 'pdf',
    file_size: 4718592, // 4.5 MB
    download_count: 610,
    storage_key: 'nacos/resources/res-6/CSC301_OS_Principles.pdf',
    author: 'Dr. M. I. Ezeh',
    description: 'Process management, CPU scheduling algorithms, synchronization semaphores, memory paging, and deadlock resolution.'
  },
  { 
    id: 'res-7', 
    title: 'Database Management Systems & Relational SQL Master Guide', 
    course_code: 'CSC 302', 
    course_title: 'Database Systems',
    level: 300, 
    semester: 'Second Semester', 
    resource_type: 'document',
    category: { name: 'Books', slug: 'books' },
    file_name: 'CSC302_DBMS_Master_Guide.pdf',
    file_extension: 'pdf',
    file_size: 5242880, // 5.0 MB
    download_count: 790,
    storage_key: 'nacos/resources/res-7/CSC302_DBMS_Master_Guide.pdf',
    author: 'Dr. (Mrs) C. U. Osuagwu',
    description: 'Relational algebra, normal forms (1NF - BCNF), ER entity diagramming, SQL queries, and ACID transaction isolation.'
  },
  { 
    id: 'res-8', 
    title: 'Full-Stack Web Development with React & Node.js Video Workshop', 
    course_code: 'CSC 308', 
    course_title: 'Web Technologies & Internet Programming',
    level: 300, 
    semester: 'Second Semester', 
    resource_type: 'video',
    category: { name: 'Videos', slug: 'videos' },
    file_name: 'CSC308_Web_Dev_Workshop.mp4',
    file_extension: 'mp4',
    file_size: 67108864, // 64 MB
    download_count: 590,
    storage_key: 'nacos/resources/res-8/CSC308_Web_Dev_Workshop.mp4',
    thumbnail_storage_key: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    author: 'Tech Director (NACOS)',
    description: 'Full-stack application architecture, RESTful APIs, modern React components, Supabase integration, and deployment.'
  },
  { 
    id: 'res-9', 
    title: 'Software Engineering Methodologies & Agile Sprint Blueprints', 
    course_code: 'CSC 401', 
    course_title: 'Software Engineering',
    level: 400, 
    semester: 'First Semester', 
    resource_type: 'document',
    category: { name: 'Handouts', slug: 'handouts' },
    file_name: 'CSC401_Software_Engineering_Guide.pdf',
    file_extension: 'pdf',
    file_size: 3984588, // 3.8 MB
    download_count: 530,
    storage_key: 'nacos/resources/res-9/CSC401_Software_Engineering_Guide.pdf',
    author: 'Engr. Dr. K. C. Nwachukwu',
    description: 'SDLC methodologies, Agile Scrum sprint planning, UML modeling diagrams, automated testing, and CI/CD pipelines.'
  },
  { 
    id: 'res-10', 
    title: 'Artificial Intelligence, Heuristics & Neural Architectures', 
    course_code: 'CSC 501', 
    course_title: 'Artificial Intelligence & Expert Systems',
    level: 500, 
    semester: 'First Semester', 
    resource_type: 'document',
    category: { name: 'Books', slug: 'books' },
    file_name: 'CSC501_Artificial_Intelligence_Compendium.pdf',
    file_extension: 'pdf',
    file_size: 7340032, // 7.0 MB
    download_count: 890,
    storage_key: 'nacos/resources/res-10/CSC501_Artificial_Intelligence_Compendium.pdf',
    author: 'Dr. (Mrs) N. C. Daniel',
    description: 'Heuristic search algorithms, expert systems, deep learning architectures, CNNs, transformers, and prompt engineering.'
  },
  { 
    id: 'res-11', 
    title: 'Computer Networks, Cryptography & Security Protocols Exam Compendium', 
    course_code: 'CSC 505', 
    course_title: 'Cryptography & Information Security',
    level: 500, 
    semester: 'First Semester', 
    resource_type: 'past_question',
    category: { name: 'Past Questions', slug: 'past-questions' },
    file_name: 'CSC505_Exam_Compendium.pdf',
    file_extension: 'pdf',
    file_size: 4194304, // 4.0 MB
    download_count: 670,
    storage_key: 'nacos/resources/res-11/CSC505_Exam_Compendium.pdf',
    author: 'Prof. F. E. Onuodu',
    description: 'Past examination solutions, cryptographic cipher traces, RSA mathematical proofs, and network defense case studies.'
  },
  { 
    id: 'res-12', 
    title: 'Cloud Computing & Distributed Systems Architecture Video Lab', 
    course_code: 'CSC 509', 
    course_title: 'Machine Learning & Neural Networks',
    level: 500, 
    semester: 'Second Semester', 
    resource_type: 'video',
    category: { name: 'Videos', slug: 'videos' },
    file_name: 'CSC509_Cloud_Distributed_Systems.mp4',
    file_extension: 'mp4',
    file_size: 61865984, // 59 MB
    download_count: 420,
    storage_key: 'nacos/resources/res-12/CSC509_Cloud_Distributed_Systems.mp4',
    thumbnail_storage_key: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    author: 'NACOS Alumni Guest Lecturer',
    description: 'Distributed consensus algorithms, microservices, containerization with Docker & Kubernetes, AWS and GCP cloud infrastructure.'
  }
];

const Resources = () => {
  // Active Filter States (Strictly Level and Semester per requirement)
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Data States
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Authentication State
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return null;
  });

  // Modal States
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [targetResource, setTargetResource] = useState(null);
  const [activePreviewResource, setActivePreviewResource] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Listen for user login/logout events across tabs
  useEffect(() => {
    const handleUserUpdate = () => {
      const stored = localStorage.getItem('nacos_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleUserUpdate);
    window.addEventListener('nacos_user_updated', handleUserUpdate);
    window.addEventListener('nacos_user_logged_out', handleUserUpdate);
    return () => {
      window.removeEventListener('storage', handleUserUpdate);
      window.removeEventListener('nacos_user_updated', handleUserUpdate);
      window.removeEventListener('nacos_user_logged_out', handleUserUpdate);
    };
  }, []);

  const pendingDownloadHandledRef = useRef(false);

  // Handle cross-app auth session returned via URL hash (#auth_user=...)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('auth_user=')) {
        const rawData = hash.substring(hash.indexOf('auth_user=') + 10);
        const cleanData = decodeURIComponent(rawData);
        const userData = JSON.parse(cleanData);
        if (userData && (userData.id || userData.registration_number || userData.regNo)) {
          localStorage.setItem('nacos_user', JSON.stringify(userData));
          localStorage.setItem('nacos_last_activity', Date.now().toString());
          setUser(userData);
          window.dispatchEvent(new Event('nacos_user_updated'));

          // Remove the hash fragment cleanly from URL bar without causing page reload
          const cleanUrl = window.location.pathname + window.location.search;
          window.history.replaceState(null, '', cleanUrl);

          const studentName = userData.firstName || userData.name || 'Student';
          showToast(`Welcome back, ${studentName}! Authenticated successfully.`);
        }
      }
    } catch (e) {
      console.warn('Error reading auth hash session:', e);
    }
  }, []);

  // Auto-trigger pending download once student is authenticated and resource catalog has loaded
  useEffect(() => {
    if (!user || resources.length === 0 || pendingDownloadHandledRef.current) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const pendingDownloadId = params.get('download');
      if (pendingDownloadId) {
        const itemToDownload = resources.find(r => String(r.id) === String(pendingDownloadId));
        if (itemToDownload) {
          pendingDownloadHandledRef.current = true;
          // Clean the download param from URL bar
          params.delete('download');
          const newSearch = params.toString() ? `?${params.toString()}` : '';
          window.history.replaceState(null, '', window.location.pathname + newSearch);

          showToast(`Resuming download for "${itemToDownload.title}"...`);
          executeDownload(itemToDownload);
        }
      }
    } catch (e) {
      console.warn('Error handling pending download:', e);
    }
  }, [user, resources]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 280);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      const res = await fetchResourceCategories();
      if (res.data && res.data.length > 0) {
        setCategories(res.data);
      } else {
        setCategories([
          { id: 'all', name: 'All Resources', slug: 'all' },
          { id: 'cat-books', name: 'Books', slug: 'books' },
          { id: 'cat-handouts', name: 'Handouts', slug: 'handouts' },
          { id: 'cat-past-questions', name: 'Past Questions', slug: 'past-questions' },
          { id: 'cat-videos', name: 'Videos', slug: 'videos' },
          { id: 'cat-tutorials', name: 'Tutorials', slug: 'tutorials' }
        ]);
      }
    }
    loadCategories();
  }, []);

  // Load Resources from Supabase / Seed Fallback
  const loadResourceData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Map UI filters to Supabase query parameters
      const levelParam = selectedLevel === 'All Levels' 
        ? null 
        : parseInt(selectedLevel.replace(' Level', ''), 10);
      
      const semesterParam = selectedSemester === 'All Semesters' 
        ? null 
        : selectedSemester;

      const categoryParam = activeCategory === 'All Resources' 
        ? null 
        : activeCategory.toLowerCase().replace(/s$/, '');

      const res = await fetchResources({
        level: levelParam,
        semester: semesterParam,
        search: debouncedSearch,
        limit: 100
      });

      if (res.data && res.data.length > 0) {
        let items = res.data;
        // Filter by category if specified
        if (activeCategory !== 'All Resources') {
          const matchCat = activeCategory.toLowerCase();
          items = items.filter(r => {
            const catName = (r.category?.name || '').toLowerCase();
            const catSlug = (r.category?.slug || '').toLowerCase();
            const resType = (r.resource_type || '').toLowerCase();
            return catName.includes(matchCat) || catSlug.includes(matchCat) || `${resType}s` === matchCat || resType === matchCat;
          });
        }
        setResources(items);
      } else {
        // Fallback filter
        let filteredSeed = FALLBACK_RESOURCES.filter(item => {
          // Level filter
          if (selectedLevel !== 'All Levels') {
            const lvlNum = parseInt(selectedLevel.replace(' Level', ''), 10);
            if (item.level !== lvlNum) return false;
          }
          // Semester filter
          if (selectedSemester !== 'All Semesters' && item.semester !== selectedSemester) {
            return false;
          }
          // Category filter
          if (activeCategory !== 'All Resources') {
            const matchCat = activeCategory.toLowerCase();
            const catName = (item.category?.name || '').toLowerCase();
            const resType = (item.resource_type || '').toLowerCase();
            if (!catName.includes(matchCat) && `${resType}s` !== matchCat && resType !== matchCat) {
              return false;
            }
          }
          // Search query
          if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            const matchCode = (item.course_code || '').toLowerCase().includes(q);
            const matchTitle = (item.title || '').toLowerCase().includes(q);
            const matchAuthor = (item.author || '').toLowerCase().includes(q);
            const matchDesc = (item.description || '').toLowerCase().includes(q);
            if (!matchCode && !matchTitle && !matchAuthor && !matchDesc) return false;
          }
          return true;
        });

        setResources(filteredSeed);
      }
    } catch (err) {
      console.warn('Supabase fetch fallback:', err);
      setResources(FALLBACK_RESOURCES);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLevel, selectedSemester, activeCategory, debouncedSearch]);

  useEffect(() => {
    loadResourceData();
  }, [loadResourceData]);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Guard Handler: Trigger Preview or Prompt Sign-In
  const handlePreviewClick = (resource) => {
    if (!user || !user.id && !user.regNo && !user.matric && !user.registration_number) {
      setTargetResource(resource);
      setIsSignInModalOpen(true);
      return;
    }

    // User is logged in: proceed with preview
    openPreviewModal(resource);
  };

  // Auth Guard Handler: Trigger Download or Prompt Sign-In
  const handleDownloadClick = (resource) => {
    if (!user || !user.id && !user.regNo && !user.matric && !user.registration_number) {
      setTargetResource(resource);
      setIsSignInModalOpen(true);
      return;
    }

    // User is logged in: proceed with direct download
    executeDownload(resource);
  };

  // Open Preview Modal
  const openPreviewModal = async (resource) => {
    setActivePreviewResource(resource);
    setIsLoadingPreview(true);
    setPreviewUrl(null);

    // Record view analytics in database
    if (resource.id) {
      recordResourceView(resource.id, { userId: user?.id || null }).catch(err => console.warn(err));
    }

    try {
      const url = await storageService.getPreviewUrl(resource.storage_key);
      setPreviewUrl(url || resource.storage_key);
    } catch (e) {
      setPreviewUrl(resource.storage_key);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Execute Download
  const executeDownload = async (resource) => {
    setDownloadingId(resource.id);
    try {
      // 1. Record download count in database
      if (resource.id) {
        recordResourceDownload(resource.id, {
          userId: user?.id || null,
          userAgent: navigator.userAgent
        }).catch(err => console.warn(err));
      }

      // Optimistically increment download count in UI
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, download_count: (r.download_count || 0) + 1 } : r));

      // 2. Obtain download URL from Backblaze B2
      let url = await storageService.getDownloadUrl(resource.storage_key, {
        downloadFileName: resource.file_name || `${resource.title}.${resource.file_extension || 'pdf'}`
      });

      if (!url) {
        url = `/downloads/${resource.file_name || 'document.pdf'}`;
      }

      // 3. Initiate browser file download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resource.file_name || `${resource.course_code || 'Resource'}.${resource.file_extension || 'pdf'}`);
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

  // Redirect to Portal Sign-In
  const handleRedirectToSignIn = () => {
    const portalUrl = getAppUrls().portal;
    let returnUrl = window.location.href;
    if (targetResource?.id) {
      try {
        const urlObj = new URL(window.location.href);
        urlObj.searchParams.set('download', targetResource.id);
        returnUrl = urlObj.toString();
      } catch (e) {
        const separator = returnUrl.includes('?') ? '&' : '?';
        returnUrl = `${returnUrl}${separator}download=${encodeURIComponent(targetResource.id)}`;
      }
    }
    const loginTarget = `${portalUrl}/login?redirect=${encodeURIComponent(returnUrl)}`;
    window.location.href = loginTarget;
  };

  const handleResetFilters = () => {
    setSelectedLevel('All Levels');
    setSelectedSemester('All Semesters');
    setActiveCategory('All Resources');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedLevel !== 'All Levels' || selectedSemester !== 'All Semesters' || searchQuery.trim() !== '' || activeCategory !== 'All Resources';

  const formatFileSize = (bytes) => {
    if (!bytes || bytes <= 0) return 'Standard PDF';
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getResourceIcon = (type, ext) => {
    const clean = (type || ext || '').toLowerCase();
    if (clean.includes('video') || clean.includes('mp4')) {
      return <FiVideo className="text-3xl sm:text-4xl text-[#4bd043]" />;
    }
    if (clean.includes('book')) {
      return <FiBook className="text-3xl sm:text-4xl text-[#4bd043]" />;
    }
    return <FiFileText className="text-3xl sm:text-4xl text-[#4bd043]" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#041801] text-gray-900 dark:text-white transition-colors duration-300">
      <Navbar />

      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded bg-white dark:bg-[#083002] border border-emerald-500/40 text-gray-900 dark:text-white shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200">
          {toastMessage.type === 'error' ? (
            <FiAlertCircle className="w-4 h-4 text-red-500" />
          ) : (
            <FiCheckCircle className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      <main className="flex-grow site-container w-full py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#138601]/20 dark:border-[#138601]/30 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="p-1.5 rounded bg-[#138601]/10 dark:bg-[#138601]/20 text-[#138601] dark:text-[#4bd043] border border-[#138601]/20">
                <FiFolder className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#083002] dark:text-white tracking-tight">
                Academic Resource Hub
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#083002]/70 dark:text-green-100/70 max-w-2xl leading-relaxed">
              Explore departmental lecture notes, official course handouts, textbook compendiums, past examination solutions, and video masterclasses.
            </p>
          </div>

          {/* User Status Pill / Sign In Indicator */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#138601]/10 dark:bg-[#138601]/20 border border-[#138601]/30 text-xs text-[#138601] dark:text-[#4bd043] font-semibold">
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Signed in as {user.firstName || user.name || 'Student'}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRedirectToSignIn}
                className="flex items-center gap-2 px-4 py-2 rounded bg-[#138601] hover:bg-[#0f6c01] text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <FiUser className="w-3.5 h-3.5" />
                <span>Sign In to Student Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* ─── Filter Bar: Level & Semester Selectors + Search Query ─── */}
        <div className="bg-[#f8fdf7] dark:bg-[#083002] rounded border border-gray-200 dark:border-[#138601]/30 p-3 sm:p-4 mb-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            
            {/* Level Selector */}
            <div className="md:w-52 shrink-0">
              <label htmlFor="resource-level-filter" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-green-200/70 mb-1">
                Academic Level
              </label>
              <select
                id="resource-level-filter"
                aria-label="Filter by academic level"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-xs text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] transition-colors cursor-pointer"
              >
                <option value="All Levels">All Levels (100L – 500L)</option>
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
              </select>
            </div>

            {/* Semester Selector */}
            <div className="md:w-52 shrink-0">
              <label htmlFor="resource-semester-filter" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-green-200/70 mb-1">
                Semester Term
              </label>
              <select
                id="resource-semester-filter"
                aria-label="Filter by semester"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-xs text-gray-800 dark:text-gray-100 font-medium focus:outline-none focus:ring-1 focus:ring-[#138601] transition-colors cursor-pointer"
              >
                <option value="All Semesters">All Semesters (1st & 2nd)</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>

            {/* Search by Course Code, Title, or Lecturer */}
            <div className="relative flex-1">
              <label htmlFor="resource-search-input" className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-green-200/70 mb-1">
                Search Catalog
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-3.5 h-3.5 pointer-events-none" />
                <input
                  type="text"
                  id="resource-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Course Code (e.g. CSC 201), Title, or Instructor..."
                  className="w-full pl-9 pr-8 py-2 rounded border border-gray-200 dark:border-[#138601]/40 bg-white dark:bg-[#041801] text-xs text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#138601] transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold p-1 cursor-pointer"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Category Filter Pills & Reset Action ─── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {['All Resources', 'Handouts', 'Books', 'Past Questions', 'Videos', 'Tutorials'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded font-semibold text-xs transition-colors cursor-pointer border ${
                  activeCategory === cat
                    ? 'bg-[#138601] text-white border-[#138601] shadow-xs'
                    : 'bg-[#f2fbf1] dark:bg-[#083002] text-[#083002] dark:text-green-100 border-[#138601]/20 dark:border-[#138601]/30 hover:bg-[#e2f7df] dark:hover:bg-[#138601]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-[#138601] dark:text-[#4bd043] font-semibold hover:underline cursor-pointer"
              >
                <FiRefreshCw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
            <span className="text-xs text-gray-500 dark:text-green-200/70 font-medium">
              Showing <strong className="text-gray-900 dark:text-white">{resources.length}</strong> resources
            </span>
          </div>
        </div>

        {/* ─── Resources Grid Display ─── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-[#f8fdf7] dark:bg-[#083002] rounded border border-[#138601]/20 p-5 space-y-4 animate-pulse">
                <div className="h-32 bg-gray-200 dark:bg-[#041801] rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const isVideo = resource.resource_type === 'video' || resource.file_extension === 'mp4';

              return (
                <div
                  key={resource.id}
                  className="bg-[#f8fdf7] dark:bg-[#083002] rounded overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-[#138601]/20 dark:border-[#138601]/30 flex flex-col justify-between group"
                >
                  {/* Card Visual Header */}
                  <div className="h-36 bg-[#041801] flex items-center justify-center text-white border-b border-[#138601]/20 relative overflow-hidden">
                    {isVideo && (resource.thumbnail_storage_key || resource.thumbnail_key) ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={resource.thumbnail_storage_key || resource.thumbnail_key} 
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-[#138601] text-white flex items-center justify-center shadow-md">
                            <FiPlay className="w-4 h-4 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      getResourceIcon(resource.category?.name || resource.resource_type, resource.file_extension)
                    )}

                    {/* Level & Semester Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-black/75 backdrop-blur-xs text-green-300 px-2 py-0.5 rounded border border-green-400/30">
                        {resource.level ? `${resource.level}L` : 'General'}
                      </span>
                      <span className="text-[10px] font-medium bg-black/75 backdrop-blur-xs text-gray-200 px-2 py-0.5 rounded border border-white/20">
                        {resource.semester === 'First Semester' ? '1st Sem' : resource.semester === 'Second Semester' ? '2nd Sem' : resource.semester || 'All Sem'}
                      </span>
                    </div>

                    {/* File type badge */}
                    <div className="absolute top-2.5 right-2.5">
                      <span className="text-[10px] font-bold bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded border border-white/20 uppercase">
                        {resource.file_extension || (isVideo ? 'MP4' : 'PDF')}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[#138601] dark:text-[#4bd043] bg-white dark:bg-[#041801] px-2 py-0.5 rounded border border-[#138601]/25">
                          {resource.course_code || 'GEN'}
                        </span>
                        <span className="text-[11px] text-gray-500 dark:text-green-200/70 font-medium">
                          {resource.category?.name || resource.resource_type || 'Material'}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-[#083002] dark:text-white leading-snug group-hover:text-[#138601] dark:group-hover:text-[#4bd043] transition-colors">
                        {resource.title}
                      </h3>

                      {(resource.author || resource.lecturer) && (
                        <p className="text-xs text-[#083002]/70 dark:text-green-100/70 mt-1 font-medium">
                          Instructor: {resource.author || resource.lecturer}
                        </p>
                      )}

                      {resource.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 leading-relaxed">
                          {resource.description}
                        </p>
                      )}
                    </div>

                    {/* Card Footer Action Strip */}
                    <div className="pt-3 border-t border-[#138601]/15 dark:border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-green-200/70 font-mono">
                        <span>{formatFileSize(resource.file_size)}</span>
                        <span>{resource.download_count || 0} downloads</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Preview Button */}
                        <button
                          type="button"
                          onClick={() => handlePreviewClick(resource)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold bg-white dark:bg-[#041801] hover:bg-[#138601]/10 dark:hover:bg-[#138601]/20 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>{isVideo ? 'Watch' : 'Preview'}</span>
                        </button>

                        {/* Download Button */}
                        <button
                          type="button"
                          disabled={downloadingId === resource.id}
                          onClick={() => handleDownloadClick(resource)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                        >
                          <FiDownload className="w-3.5 h-3.5" />
                          <span>{downloadingId === resource.id ? 'Loading...' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#f8fdf7] dark:bg-[#083002] rounded border border-dashed border-[#138601]/30">
            <FiSearch className="mx-auto text-4xl text-gray-400 dark:text-gray-500 mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-white">No academic resources found</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-md mx-auto leading-relaxed">
              We couldn't find any resources matching your selected level, semester, or search query. Try adjusting your filter parameters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-[#138601] hover:bg-[#0f6c01] text-white font-semibold rounded text-xs transition-colors shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* ─── AUTHENTICATION REQUIRED MODAL ─── */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#138601]/15 text-[#138601] dark:text-[#4bd043] flex items-center justify-center">
                  <FiLock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Student Sign-In Required</h3>
                  <p className="text-[11px] text-gray-500 dark:text-green-200/70">NACOS FUTO Academic Portal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSignInModalOpen(false);
                  setTargetResource(null);
                }}
                className="p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#041801] transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded bg-[#f8fafc] dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 space-y-2">
              <p className="text-xs text-gray-700 dark:text-green-100 leading-relaxed">
                Access to official departmental lecture notes, textbook references, past examination solutions, and video archives is reserved for verified <strong>NACOS FUTO</strong> students.
              </p>
              {targetResource && (
                <div className="pt-2 border-t border-gray-200 dark:border-[#138601]/20">
                  <p className="text-[11px] text-gray-500 dark:text-green-200/70 font-semibold truncate">
                    Selected: {targetResource.course_code} — {targetResource.title}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignInModalOpen(false);
                  setTargetResource(null);
                }}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-[#138601]/20 border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRedirectToSignIn}
                className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
              >
                <span>Sign In to Portal</span>
                <FiArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESOURCE PREVIEW MODAL ─── */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-[#138601]/25 flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {activePreviewResource.course_code && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#138601]/10 dark:bg-[#041801] text-[#138601] dark:text-[#4bd043] border border-[#138601]/30">
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
                  onClick={() => executeDownload(activePreviewResource)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
                >
                  <FiDownload className="w-3.5 h-3.5" />
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
                  <FiX className="w-5 h-5" />
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

                  {/* HTML5 Video Player */}
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

                  {/* Fallback info when preview not supported directly */}
                  {!['pdf', 'mp4', 'jpg', 'jpeg', 'png', 'webp'].includes(activePreviewResource.file_extension) && (
                    <div className="p-8 rounded border border-gray-200 dark:border-[#138601]/30 bg-gray-50 dark:bg-[#041801] text-center space-y-3">
                      <FiFileText className="w-12 h-12 text-[#138601] dark:text-[#4bd043] mx-auto" />
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">Document Preview</h4>
                      <p className="text-xs text-gray-500 dark:text-green-200/70 max-w-md mx-auto">
                        This file ({activePreviewResource.file_name}) cannot be rendered directly in the web browser previewer. Click download below to view it locally.
                      </p>
                      <button
                        type="button"
                        onClick={() => executeDownload(activePreviewResource)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] transition-colors cursor-pointer"
                      >
                        <FiDownload className="w-3.5 h-3.5" />
                        <span>Download {activePreviewResource.file_extension?.toUpperCase() || 'File'}</span>
                      </button>
                    </div>
                  )}

                  {/* Resource Details & Description */}
                  <div className="p-4 rounded bg-gray-50 dark:bg-[#041801] border border-gray-200/80 dark:border-[#138601]/20 space-y-1.5 text-xs">
                    <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-[10px]">Resource Details</span>
                    <p className="text-gray-600 dark:text-green-200/80 leading-relaxed">
                      {activePreviewResource.description || 'Official academic departmental resource uploaded for computer science undergraduates.'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Resources;

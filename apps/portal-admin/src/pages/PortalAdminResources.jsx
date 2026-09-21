import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PortalAdminLayout from '../components/PortalAdminLayout';
import {
  BookOpen,
  Upload,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  Download,
  Check,
  X,
  FileText,
  Video,
  Image as ImageIcon,
  FolderPlus,
  Layers,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HardDrive,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Clock,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Plus
} from 'lucide-react';
import {
  fetchResources,
  fetchResourceCategories,
  adminCreateResource,
  adminUpdateResource,
  adminDeleteResource,
  adminGetResourceAnalytics,
  adminCreateCategory,
  adminDeleteCategory,
  storageService
} from '@nacos/supabase';
import { getPortalAdminSession } from '@nacos/auth';

const PortalAdminResources = () => {
  const [adminSession, setAdminSession] = useState(null);

  // Data States
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalResources: 0,
    activeResources: 0,
    totalDownloads: 0,
    totalStorageBytes: 0,
    topDownloaded: [],
    recentUploads: []
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // UI / Modal States
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedResourceForEdit, setSelectedResourceForEdit] = useState(null);
  const [deleteConfirmResource, setDeleteConfirmResource] = useState(null);
  const [notification, setNotification] = useState(null);

  // Upload Form State
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    courseCode: '',
    level: '300',
    session: '2024/2025',
    resourceType: 'document',
    isPublic: true,
    isActive: true,
    thumbnailUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDescription, setNewCatDescription] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Folder');

  useEffect(() => {
    const session = getPortalAdminSession();
    setAdminSession(session);
    loadAllData();
  }, []);

  const showNotification = (text, type = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [resData, catData, anaData] = await Promise.all([
        fetchResources({ limit: 100, includeInactive: true }),
        fetchResourceCategories({ includeInactive: true }),
        adminGetResourceAnalytics()
      ]);

      if (resData.data) setResources(resData.data);
      if (catData.data) {
        setCategories(catData.data);
        if (catData.data.length > 0 && !uploadFormData.categoryId) {
          setUploadFormData(prev => ({ ...prev, categoryId: catData.data[0].id }));
        }
      }
      if (anaData.data) setAnalytics(anaData.data);
    } catch (err) {
      console.warn('Error loading admin resource data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and Search Memo
  const filteredResources = useMemo(() => {
    return resources.filter(item => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (item.category_id !== selectedCategory && item.category?.slug !== selectedCategory) return false;
      }
      // Level filter
      if (selectedLevel !== 'all' && item.level && item.level.toString() !== selectedLevel) return false;
      // Type filter
      if (selectedType !== 'all' && item.resource_type !== selectedType) return false;
      // Status filter
      if (selectedStatus === 'active' && !item.is_active) return false;
      if (selectedStatus === 'inactive' && item.is_active) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchCourse = item.course_code?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchFile = item.file_name?.toLowerCase().includes(q);
        if (!matchTitle && !matchCourse && !matchDesc && !matchFile) return false;
      }

      return true;
    });
  }, [resources, selectedCategory, selectedLevel, selectedType, selectedStatus, searchQuery]);

  // Handle File Selection
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 200MB)
    if (file.size > 200 * 1024 * 1024) {
      setUploadError('File size exceeds the 200MB maximum limit.');
      return;
    }

    setUploadError('');
    setSelectedFile(file);

    // Auto-detect file extension & type
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
    let detectedType = 'document';
    if (['mp4', 'mkv', 'mov', 'webm'].includes(ext)) detectedType = 'video';
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) detectedType = 'image';
    if (['zip', 'rar', '7z', 'tar'].includes(ext)) detectedType = 'archive';

    // Auto-fill title if empty
    if (!uploadFormData.title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setUploadFormData(prev => ({ ...prev, title: cleanName, resourceType: detectedType }));
    }
  };

  // Submit Upload to Cloudflare R2 + Supabase
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }
    if (!uploadFormData.title.trim()) {
      setUploadError('Resource title is required.');
      return;
    }

    setIsSubmittingUpload(true);
    setUploadProgress(10);
    setUploadError('');

    let uploadedStorageKey = null;

    try {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase() || 'pdf';
      const resourceUuid = crypto.randomUUID();

      // 1. Upload file to Cloudflare R2 via storageService abstraction
      const uploadRes = await storageService.upload(selectedFile, {
        resourceId: resourceUuid,
        type: 'original',
        fileName: selectedFile.name,
        mimeType: selectedFile.type,
        onProgress: (percent) => setUploadProgress(Math.min(90, Math.max(15, percent)))
      });

      uploadedStorageKey = uploadRes.storageKey;
      setUploadProgress(95);

      // 2. Create resource metadata in Supabase
      const { data: newRecord, error: dbError } = await adminCreateResource({
        title: uploadFormData.title,
        description: uploadFormData.description,
        categoryId: uploadFormData.categoryId || categories[0]?.id,
        courseCode: uploadFormData.courseCode,
        level: uploadFormData.level,
        session: uploadFormData.session,
        resourceType: uploadFormData.resourceType,
        fileName: selectedFile.name,
        fileExtension: ext,
        mimeType: selectedFile.type || 'application/octet-stream',
        fileSize: selectedFile.size,
        storageProvider: uploadRes.storageProvider || 'cloudflare_r2',
        storageKey: uploadRes.storageKey,
        thumbnailKey: uploadFormData.thumbnailUrl || null,
        isPublic: uploadFormData.isPublic,
        isActive: uploadFormData.isActive,
        uploadedBy: adminSession?.id || null
      });

      if (dbError) {
        // Rollback uploaded storage object on DB failure
        if (uploadedStorageKey) {
          await storageService.delete(uploadedStorageKey).catch(e => console.warn(e));
        }
        throw new Error(dbError);
      }

      setUploadProgress(100);
      showNotification(`Resource "${uploadFormData.title}" uploaded & published successfully!`);

      // Reset Form and Refresh List
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadFormData({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        courseCode: '',
        level: '300',
        session: '2024/2025',
        resourceType: 'document',
        isPublic: true,
        isActive: true,
        thumbnailUrl: ''
      });

      loadAllData();
    } catch (err) {
      setUploadError(err.message || 'An error occurred during upload. Please check storage credentials.');
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // Toggle Active Status
  const handleToggleStatus = async (resource) => {
    const nextStatus = !resource.is_active;
    // Optimistic UI update
    setResources(prev => prev.map(r => r.id === resource.id ? { ...r, is_active: nextStatus } : r));

    try {
      const { error } = await adminUpdateResource(resource.id, { is_active: nextStatus });
      if (error) throw error;
      showNotification(`Resource ${nextStatus ? 'published' : 'unpublished'} successfully.`);
    } catch (err) {
      // Revert on error
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, is_active: !nextStatus } : r));
      showNotification('Failed to update status.', 'error');
    }
  };

  // Delete Resource Action
  const handleDeleteResource = async () => {
    if (!deleteConfirmResource) return;
    const { id, title, storage_key, thumbnail_key } = deleteConfirmResource;

    try {
      const { error } = await adminDeleteResource(id, storage_key, thumbnail_key);
      if (error) throw new Error(error);

      setResources(prev => prev.filter(r => r.id !== id));
      setDeleteConfirmResource(null);
      showNotification(`Resource "${title}" and associated storage files deleted.`);
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Failed to delete resource.', 'error');
    }
  };

  // Save Edit Metadata
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!selectedResourceForEdit) return;

    try {
      const { data, error } = await adminUpdateResource(selectedResourceForEdit.id, {
        title: selectedResourceForEdit.title,
        description: selectedResourceForEdit.description,
        course_code: selectedResourceForEdit.course_code,
        level: selectedResourceForEdit.level ? parseInt(selectedResourceForEdit.level, 10) : null,
        session: selectedResourceForEdit.session,
        resource_type: selectedResourceForEdit.resource_type,
        category_id: selectedResourceForEdit.category_id,
        is_public: selectedResourceForEdit.is_public,
        is_active: selectedResourceForEdit.is_active
      });

      if (error) throw new Error(error);

      showNotification('Resource metadata updated successfully!');
      setIsEditModalOpen(false);
      setSelectedResourceForEdit(null);
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Failed to update resource', 'error');
    }
  };

  // Category Manager: Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const { data, error } = await adminCreateCategory({
        name: newCatName.trim(),
        description: newCatDescription.trim(),
        icon: newCatIcon
      });

      if (error) throw new Error(error);

      showNotification(`Category "${newCatName}" created!`);
      setNewCatName('');
      setNewCatDescription('');
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Failed to create category', 'error');
    }
  };

  // Category Manager: Delete Category
  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Delete category "${catName}"? Existing resources in this category will become unassigned.`)) return;

    try {
      const { error } = await adminDeleteCategory(catId);
      if (error) throw new Error(error);

      showNotification(`Category "${catName}" deleted.`);
      loadAllData();
    } catch (err) {
      showNotification(err.message || 'Failed to delete category', 'error');
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes <= 0) return '0 MB';
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <PortalAdminLayout
      title="Student Resource Hub Management"
      subtitle="Upload, publish, organize, and monitor academic documents, past questions, and video tutorials on Cloudflare R2."
    >
      <div className="space-y-6 font-sans">

        {/* Global Feedback Banner */}
        {notification && (
          <div className="p-3.5 rounded text-xs font-semibold flex items-center gap-2 shadow-xs bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800/40 animate-fade-in">
            <Check className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
            <span>{notification.text}</span>
          </div>
        )}

        {/* Top Header Strip with Upload Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 shadow-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded bg-green-500/10 text-[#138601] dark:text-[#4bd043] border border-[#138601]/20">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                Academic Resource Repository
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-green-200/70">
              Direct-to-R2 streaming file delivery with atomic download tracking and granular access policies.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded text-xs font-semibold bg-gray-100 dark:bg-[#041801] hover:bg-gray-200 dark:hover:bg-[#138601]/20 text-gray-700 dark:text-green-200 border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload New Resource</span>
            </button>
          </div>
        </div>

        {/* Analytics & Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 dark:text-green-200/70">
              <span className="text-xs font-semibold">Total Resources</span>
              <BookOpen className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{analytics.totalResources || resources.length}</div>
            <span className="text-[10px] text-green-600 dark:text-green-300 font-medium">
              {analytics.activeResources || resources.filter(r => r.is_active).length} Active & Published
            </span>
          </div>

          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 dark:text-green-200/70">
              <span className="text-xs font-semibold">Total Downloads</span>
              <TrendingUp className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
            </div>
            <div className="text-2xl font-bold text-[#138601] dark:text-[#4bd043]">
              {analytics.totalDownloads || resources.reduce((acc, r) => acc + (r.download_count || 0), 0)}
            </div>
            <span className="text-[10px] text-gray-500 dark:text-green-200/70 font-medium">Atomic concurrency safe</span>
          </div>

          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 dark:text-green-200/70">
              <span className="text-xs font-semibold">Cloud Storage Footprint</span>
              <HardDrive className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatBytes(analytics.totalStorageBytes || resources.reduce((acc, r) => acc + (r.file_size || 0), 0))}
            </div>
            <span className="text-[10px] text-green-600 dark:text-green-300 font-medium">Cloudflare R2 Bucket</span>
          </div>

          <div className="p-5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 space-y-1 shadow-xs">
            <div className="flex items-center justify-between text-gray-500 dark:text-green-200/70">
              <span className="text-xs font-semibold">Delivery Security</span>
              <ShieldCheck className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">Protected</div>
            <span className="text-[10px] text-green-600 dark:text-green-300 font-medium">Presigned URL Expiry (1h)</span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="p-4 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xs">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded text-xs bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-1.5 rounded text-xs bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
            >
              <option value="all">All Levels</option>
              <option value="100">100L</option>
              <option value="200">200L</option>
              <option value="300">300L</option>
              <option value="400">400L</option>
              <option value="500">500L</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded text-xs bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
            >
              <option value="all">All Status</option>
              <option value="active">Active & Published</option>
              <option value="inactive">Unpublished / Draft</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded text-xs bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#138601]"
            />
          </div>
        </div>

        {/* Resources Table */}
        <div className="rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/30 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-[#041801] border-b border-gray-200 dark:border-[#138601]/30 text-gray-500 dark:text-green-200/70 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Resource Info</th>
                  <th className="px-4 py-3">Category & Course</th>
                  <th className="px-4 py-3">File Specs</th>
                  <th className="px-4 py-3">Downloads</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#138601]/10">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-green-200/70">
                      Loading resources from database...
                    </td>
                  </tr>
                ) : filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center text-gray-500 dark:text-green-200/70 space-y-2">
                      <BookOpen className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="font-semibold text-gray-900 dark:text-white">No resources match criteria</p>
                      <p className="text-[11px]">Click "Upload New Resource" to add material to the hub.</p>
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#041801]/60 transition-colors">
                      {/* Info */}
                      <td className="px-4 py-3.5 max-w-xs">
                        <div className="font-bold text-gray-900 dark:text-white truncate" title={item.title}>
                          {item.title}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-green-200/70 truncate mt-0.5">
                          {item.file_name}
                        </div>
                      </td>

                      {/* Category & Course */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {item.category?.name || 'General'}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-green-200/70 mt-0.5">
                          {item.course_code ? `${item.course_code} • ${item.level}L` : `${item.level ? item.level + 'L' : 'All Levels'}`}
                        </div>
                      </td>

                      {/* File Specs */}
                      <td className="px-4 py-3.5 font-mono text-[11px]">
                        <span className="uppercase font-semibold text-[#138601] dark:text-[#4bd043]">
                          {item.file_extension || 'PDF'}
                        </span>
                        <div className="text-gray-500 dark:text-green-200/70">
                          {formatBytes(item.file_size)}
                        </div>
                      </td>

                      {/* Downloads */}
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {item.download_count || 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(item)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                            item.is_active
                              ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          <span>{item.is_active ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Edit Resource"
                            onClick={() => {
                              setSelectedResourceForEdit({ ...item });
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 rounded text-gray-500 dark:text-green-200/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#041801] transition-colors cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Delete Resource"
                            onClick={() => setDeleteConfirmResource(item)}
                            className="p-1.5 rounded text-red-500 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── MODAL 1: UPLOAD NEW RESOURCE TO CLOUDFLARE R2 ─── */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              
              <div className="p-5 border-b border-gray-100 dark:border-[#138601]/25 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-green-50 dark:bg-[#138601]/20 text-[#138601] dark:text-[#4bd043] flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Upload Resource to Hub</h3>
                    <p className="text-[11px] text-gray-500 dark:text-green-200/70">Files stream directly to Cloudflare R2 object storage</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedFile(null);
                    setUploadError('');
                  }}
                  className="p-1.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                {uploadError && (
                  <div className="p-3 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* File Dropzone */}
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                    Select File (PDF, MP4, DOCX, ZIP, Image) *
                  </label>
                  <div className="p-4 rounded border-2 border-dashed border-gray-300 dark:border-[#138601]/40 bg-gray-50 dark:bg-[#041801] text-center space-y-2">
                    <input
                      type="file"
                      id="resource-file-input"
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.zip,.rar,.png,.jpg,.jpeg,.webp"
                    />
                    <label
                      htmlFor="resource-file-input"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] cursor-pointer shadow-xs transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{selectedFile ? 'Change File' : 'Browse File from Device'}</span>
                    </label>
                    <p className="text-[11px] text-gray-500 dark:text-green-200/70">
                      {selectedFile ? `${selectedFile.name} (${formatBytes(selectedFile.size)})` : 'Maximum file size: 200MB'}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSC 201 Comprehensive Examination Solutions & Code Traces"
                    value={uploadFormData.title}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                    Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Provide context, topics covered, and key guidelines for students..."
                    value={uploadFormData.description}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                  />
                </div>

                {/* Category & Course Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                      Resource Category *
                    </label>
                    <select
                      value={uploadFormData.categoryId}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                      Course Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CSC 201"
                      value={uploadFormData.courseCode}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, courseCode: e.target.value.toUpperCase() }))}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Level & Session Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                      Target Student Level
                    </label>
                    <select
                      value={uploadFormData.level}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    >
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                      <option value="500">500 Level</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                      Academic Session
                    </label>
                    <select
                      value={uploadFormData.session}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, session: e.target.value }))}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    >
                      <option value="2025/2026">2025/2026</option>
                      <option value="2024/2025">2024/2025</option>
                      <option value="2023/2024">2023/2024</option>
                      <option value="2022/2023">2022/2023</option>
                    </select>
                  </div>
                </div>

                {/* Resource Type */}
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={uploadFormData.resourceType}
                    onChange={(e) => setUploadFormData(prev => ({ ...prev, resourceType: e.target.value }))}
                    className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                  >
                    <option value="document">Course Notes / PDF Document</option>
                    <option value="past_question">Past Questions & Solutions</option>
                    <option value="video">Video Tutorial</option>
                    <option value="image">Image / Graphic / Flyer</option>
                    <option value="archive">ZIP / Source Code Archive</option>
                  </select>
                </div>

                {/* Video Thumbnail URL (if video) */}
                {uploadFormData.resourceType === 'video' && (
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">
                      Video Cover Thumbnail URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={uploadFormData.thumbnailUrl}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                      className="w-full px-3.5 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {/* Visibility and Active status check */}
                <div className="flex items-center gap-5 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadFormData.isPublic}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded text-[#138601] focus:ring-[#138601]"
                    />
                    <span className="font-semibold text-gray-700 dark:text-green-200">Public Access</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadFormData.isActive}
                      onChange={(e) => setUploadFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded text-[#138601] focus:ring-[#138601]"
                    />
                    <span className="font-semibold text-gray-700 dark:text-green-200">Publish Immediately</span>
                  </label>
                </div>

                {/* Progress Bar */}
                {isSubmittingUpload && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700 dark:text-green-200">
                      <span>Streaming to Cloudflare R2...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-[#041801] rounded-full overflow-hidden">
                      <div className="h-full bg-[#138601] transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 dark:border-[#138601]/20 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUploadModalOpen(false);
                      setSelectedFile(null);
                      setUploadError('');
                    }}
                    className="px-4 py-2 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingUpload || !selectedFile}
                    className="px-5 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingUpload ? 'Uploading...' : 'Confirm & Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 2: EDIT RESOURCE METADATA ─── */}
        {isEditModalOpen && selectedResourceForEdit && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-5 border-b border-gray-100 dark:border-[#138601]/25 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Edit Resource Metadata</h3>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={selectedResourceForEdit.title}
                    onChange={(e) => setSelectedResourceForEdit({ ...selectedResourceForEdit, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={selectedResourceForEdit.description || ''}
                    onChange={(e) => setSelectedResourceForEdit({ ...selectedResourceForEdit, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">Course Code</label>
                    <input
                      type="text"
                      value={selectedResourceForEdit.course_code || ''}
                      onChange={(e) => setSelectedResourceForEdit({ ...selectedResourceForEdit, course_code: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 dark:text-green-200 mb-1">Level</label>
                    <input
                      type="number"
                      value={selectedResourceForEdit.level || ''}
                      onChange={(e) => setSelectedResourceForEdit({ ...selectedResourceForEdit, level: e.target.value })}
                      className="w-full px-3 py-2 rounded bg-white dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] shadow-xs transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── MODAL 3: DELETE CONFIRMATION ─── */}
        {deleteConfirmResource && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-md p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto border border-red-200 dark:border-red-900">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1.5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Delete Academic Resource?</h3>
                <p className="text-xs text-gray-500 dark:text-green-200/70">
                  Are you sure you want to permanently delete "<strong>{deleteConfirmResource.title}</strong>"? The file will also be removed from Cloudflare R2 storage.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmResource(null)}
                  className="px-4 py-2 rounded text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteResource}
                  className="px-5 py-2 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-700 shadow-xs transition-colors cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 4: CATEGORY MANAGER ─── */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 rounded w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
              <div className="p-5 border-b border-gray-100 dark:border-[#138601]/25 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#138601] dark:text-[#4bd043]" />
                  <span>Manage Resource Categories</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-5 text-xs">
                {/* Create New Category Strip */}
                <form onSubmit={handleCreateCategory} className="p-4 rounded bg-gray-50 dark:bg-[#041801] border border-gray-200 dark:border-[#138601]/30 space-y-3">
                  <span className="font-bold text-gray-900 dark:text-white block uppercase tracking-wider text-[10px]">Add New Category</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Category Name"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="px-3 py-1.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Description (Optional)"
                      value={newCatDescription}
                      onChange={(e) => setNewCatDescription(e.target.value)}
                      className="px-3 py-1.5 rounded bg-white dark:bg-[#083002] border border-gray-200 dark:border-[#138601]/40 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Category</span>
                    </button>
                  </div>
                </form>

                {/* Existing Categories List */}
                <div className="space-y-2">
                  <span className="font-bold text-gray-900 dark:text-white block uppercase tracking-wider text-[10px]">Active Categories</span>
                  <div className="divide-y divide-gray-100 dark:divide-[#138601]/20 border border-gray-200 dark:border-[#138601]/30 rounded overflow-hidden">
                    {categories.map((cat) => (
                      <div key={cat.id} className="p-3 bg-white dark:bg-[#083002] flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white">{cat.name}</div>
                          <div className="font-mono text-[10px] text-gray-500 dark:text-green-200/60">{cat.slug}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PortalAdminLayout>
  );
};

export default PortalAdminResources;

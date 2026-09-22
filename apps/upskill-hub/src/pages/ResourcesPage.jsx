import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  FileText, 
  Video, 
  ExternalLink, 
  Search, 
  RefreshCw, 
  Download, 
  Eye, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Play, 
  Folder, 
  Layers, 
  User, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { 
  fetchResources, 
  fetchResourceCategories, 
  recordResourceDownload, 
  recordResourceView,
  storageService 
} from '@nacos/supabase';
import { useAuthStore } from '../stores/authStore';

const ResourcesPage = () => {
  const { user } = useAuthStore();
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSemester, setSelectedSemester] = useState('All Semesters');
  const [activeCategory, setActiveCategory] = useState('All Resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [activePreviewResource, setActivePreviewResource] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load Resources and Categories from Supabase / Seed
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resData, catData] = await Promise.all([
        fetchResources({}),
        fetchResourceCategories()
      ]);
      setResources(resData || []);
      setCategories(catData || []);
    } catch (err) {
      console.warn('Error loading resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // Level filter
      if (selectedLevel !== 'All Levels') {
        const matchesLevel = 
          res.academic_level === selectedLevel || 
          res.level === selectedLevel ||
          (selectedLevel === '100 Level' && (res.academic_level === '100' || res.course_code?.includes('1'))) ||
          (selectedLevel === '200 Level' && (res.academic_level === '200' || res.course_code?.includes('2'))) ||
          (selectedLevel === '300 Level' && (res.academic_level === '300' || res.course_code?.includes('3'))) ||
          (selectedLevel === '400 Level' && (res.academic_level === '400' || res.course_code?.includes('4'))) ||
          (selectedLevel === '500 Level' && (res.academic_level === '500' || res.course_code?.includes('5')));
        if (!matchesLevel) return false;
      }

      // Semester filter
      if (selectedSemester !== 'All Semesters') {
        const matchesSem = 
          res.semester === selectedSemester ||
          (selectedSemester === '1st Semester' && (res.semester === 'Harmattan' || res.semester === '1' || res.semester === 'First')) ||
          (selectedSemester === '2nd Semester' && (res.semester === 'Rain' || res.semester === '2' || res.semester === 'Second'));
        if (!matchesSem) return false;
      }

      // Category filter
      if (activeCategory !== 'All Resources') {
        if (res.category?.name !== activeCategory && res.category_name !== activeCategory && res.file_type !== activeCategory) {
          return false;
        }
      }

      // Search Query
      if (debouncedSearch.trim()) {
        const query = debouncedSearch.toLowerCase();
        const titleMatch = res.title?.toLowerCase().includes(query);
        const codeMatch = res.course_code?.toLowerCase().includes(query);
        const descMatch = res.description?.toLowerCase().includes(query);
        const authorMatch = res.author?.toLowerCase().includes(query) || res.lecturer?.toLowerCase().includes(query);
        if (!titleMatch && !codeMatch && !descMatch && !authorMatch) return false;
      }

      return true;
    });
  }, [resources, selectedLevel, selectedSemester, activeCategory, debouncedSearch]);

  const handleDownload = async (resource) => {
    setDownloadingId(resource.id);
    try {
      await recordResourceDownload(resource.id);
      const url = resource.file_url || resource.download_url;
      if (url) {
        window.open(url, '_blank');
      }
      setToastMessage(`Downloading ${resource.title}...`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePreview = (resource) => {
    recordResourceView(resource.id);
    setActivePreviewResource(resource);
  };

  return (
    <div className="min-h-screen bg-[#041801] text-white">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#138601] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="border-b border-[#138601]/25 bg-[#083002]/90 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#138601]/20 border border-[#138601]/40 text-[#4bd043] text-xs font-semibold uppercase tracking-wider mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>NACOS Academic & Developer Repository</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Curriculum <span className="text-[#4bd043]">Resources & Materials</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-green-100/70 max-w-2xl">
                Official FUTO lecture notes, vetted past questions, software toolkits, and textbook archives synchronized across all academic levels.
              </p>
            </div>

            {/* Quick Stats Counter */}
            <div className="flex items-center gap-3">
              <div className="bg-[#041801] border border-[#138601]/30 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-[#4bd043]">{resources.length || '48'}</p>
                <p className="text-[11px] uppercase font-bold text-gray-400">Total Materials</p>
              </div>
              <div className="bg-[#041801] border border-[#138601]/30 rounded-xl px-4 py-3 text-center">
                <p className="text-2xl font-black text-amber-400">100L - 500L</p>
                <p className="text-[11px] uppercase font-bold text-gray-400">Academic Clearance</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course code (e.g. CSC 301, MTH 101), lecture topic, textbook, or lecturer..."
              className="w-full pl-12 pr-10 py-3.5 bg-[#041801] border border-[#138601]/40 rounded-xl text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#138601] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog View with Filters */}
      <section className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filter Bar */}
        <div className="bg-[#083002] border border-[#138601]/30 rounded-xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Level Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="bg-[#041801] border border-[#138601]/40 text-xs font-semibold text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#138601]"
              >
                <option value="All Levels">All Levels</option>
                <option value="100 Level">100 Level</option>
                <option value="200 Level">200 Level</option>
                <option value="300 Level">300 Level</option>
                <option value="400 Level">400 Level</option>
                <option value="500 Level">500 Level</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-[#041801] border border-[#138601]/40 text-xs font-semibold text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#138601]"
              >
                <option value="All Semesters">All Semesters</option>
                <option value="1st Semester">1st Semester (Harmattan)</option>
                <option value="2nd Semester">2nd Semester (Rain)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#041801] hover:bg-[#138601]/20 text-xs font-semibold text-gray-300 hover:text-white border border-[#138601]/30 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <span className="text-xs text-gray-400 font-mono">
              Showing {filteredResources.length} materials
            </span>
          </div>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-[#083002] border border-[#138601]/20 rounded-xl p-6 animate-pulse">
                <div className="h-6 w-24 bg-[#138601]/30 rounded mb-4"></div>
                <div className="h-5 w-3/4 bg-[#138601]/20 rounded mb-3"></div>
                <div className="h-4 w-full bg-[#138601]/10 rounded mb-6"></div>
                <div className="h-9 w-full bg-[#138601]/30 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-[#083002]/60 border border-[#138601]/30 rounded-2xl p-8">
            <BookOpen className="w-12 h-12 text-[#138601] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Matching Materials Found</h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              We couldn't find any resources matching your filters. Try selecting "All Levels" or searching by course code.
            </p>
            <button
              onClick={() => { setSelectedLevel('All Levels'); setSelectedSemester('All Semesters'); setSearchQuery(''); }}
              className="px-5 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((item) => (
              <div
                key={item.id}
                className="bg-[#083002] border border-[#138601]/30 hover:border-[#138601] rounded-xl p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded bg-[#138601]/20 border border-[#138601]/40 text-[#4bd043] text-xs font-bold font-mono tracking-wide">
                      {item.course_code || 'GEN 101'}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400 bg-[#041801] px-2.5 py-0.5 rounded border border-[#138601]/20">
                      {item.academic_level || item.level || '300L'}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h3 className="text-base font-bold text-white group-hover:text-[#4bd043] transition-colors leading-snug mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-green-100/70 line-clamp-3 mb-4 leading-relaxed">
                    {item.description || 'Comprehensive lecture notes, study guide, and practice problems prepared for NACOS students.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#138601]/20">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4">
                    <span>{item.semester || '1st Semester'}</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Download className="w-3 h-3 text-[#4bd043]" />
                      {item.download_count || 12} downloads
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePreview(item)}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#041801] hover:bg-[#138601]/20 text-xs font-semibold text-white border border-[#138601]/40 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                      className="flex-1 py-2 px-3 rounded-lg bg-[#138601] hover:bg-[#0f6c01] text-xs font-semibold text-white flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingId === item.id ? 'Starting...' : 'Download'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Preview Modal */}
      {activePreviewResource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#083002] border border-[#138601]/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#138601]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#138601]/20 flex items-center justify-center text-[#4bd043]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{activePreviewResource.title}</h4>
                  <p className="text-xs text-gray-400 font-mono">{activePreviewResource.course_code} · {activePreviewResource.level}</p>
                </div>
              </div>
              <button
                onClick={() => setActivePreviewResource(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#041801] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-[#041801] p-4 rounded-xl border border-[#138601]/20">
                <p className="text-xs uppercase font-bold text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {activePreviewResource.description || 'No additional summary text provided for this resource.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-[#041801] p-3 rounded-lg border border-[#138601]/20">
                  <span className="text-gray-400 block mb-0.5">Author / Lecturer:</span>
                  <span className="text-white font-semibold">{activePreviewResource.author || activePreviewResource.lecturer || 'NACOS Academic Board'}</span>
                </div>
                <div className="bg-[#041801] p-3 rounded-lg border border-[#138601]/20">
                  <span className="text-gray-400 block mb-0.5">File Format:</span>
                  <span className="text-white font-semibold uppercase">{activePreviewResource.file_format || 'PDF / Slides'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#138601]/30 bg-[#041801]/60 flex items-center justify-end gap-3">
              <button
                onClick={() => setActivePreviewResource(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-[#041801] border border-[#138601]/30 hover:bg-[#138601]/20 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDownload(activePreviewResource)}
                className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-[#138601] hover:bg-[#0f6c01] flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;

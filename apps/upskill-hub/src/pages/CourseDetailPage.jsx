import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  ArrowLeft, 
  Menu, 
  X, 
  Award, 
  FileText, 
  HelpCircle, 
  Share2, 
  Download,
  GraduationCap,
  Clock,
  BookOpen,
  LayoutGrid
} from 'lucide-react';
import { useCourseStore } from '../stores/courseStore';
import { useAuthStore } from '../stores/authStore';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    currentCourse, 
    currentTopics, 
    fetchCourseById, 
    currentEnrollment, 
    fetchCurrentEnrollment, 
    enrollInCourse, 
    markTopicComplete, 
    status 
  } = useCourseStore();

  // Active video & curriculum states
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'quizzes' | 'certificates'
  const [expandedModules, setExpandedModules] = useState({ 0: true, 1: true, 2: true });
  const [personalNotes, setPersonalNotes] = useState('');
  const [showCompletionToast, setShowCompletionToast] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseById(id);
      if (user?.id) {
        fetchCurrentEnrollment(user.id, id);
      }
    }
  }, [id, user?.id]);

  const activeTopic = currentTopics[activeTopicIndex] || currentTopics[0];

  // Group topics into 2-3 logical course modules (like Coursera / screenshot)
  const modules = useMemo(() => {
    if (!currentTopics || currentTopics.length === 0) return [];

    const total = currentTopics.length;
    if (total <= 3) {
      return [
        {
          id: 'mod-1',
          title: currentCourse?.title ? `${currentCourse.title} - Core Architecture` : 'Core Foundations',
          topics: currentTopics,
        }
      ];
    }

    const mid = Math.ceil(total / 2);
    return [
      {
        id: 'mod-1',
        title: 'Foundations & Architectural Overview',
        topics: currentTopics.slice(0, mid),
      },
      {
        id: 'mod-2',
        title: 'Deep Dive & Practical Implementation',
        topics: currentTopics.slice(mid, total - 1),
      },
      {
        id: 'mod-3',
        title: 'Production Testing & Conclusion',
        topics: currentTopics.slice(total - 1),
      }
    ];
  }, [currentTopics, currentCourse]);

  // Completed topics tracker
  const completedTopicIds = useMemo(() => {
    return currentEnrollment?.completed_topic_ids || [];
  }, [currentEnrollment]);

  // Derived progress percentage
  const progressPercent = useMemo(() => {
    if (!currentTopics || currentTopics.length === 0) return 0;
    if (currentEnrollment?.progress_percentage !== undefined) {
      return currentEnrollment.progress_percentage;
    }
    const completedCount = completedTopicIds.length;
    return Math.min(100, Math.round((completedCount / currentTopics.length) * 100));
  }, [currentTopics, currentEnrollment, completedTopicIds]);

  const handleToggleModule = (index) => {
    setExpandedModules(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSelectTopic = (index) => {
    setActiveTopicIndex(index);
  };

  const handleMarkComplete = async () => {
    if (!activeTopic) return;
    // Auto-enroll if not enrolled
    if (!currentEnrollment && user?.id) {
      await enrollInCourse(user.id, id);
    }
    await markTopicComplete(activeTopic.id);
    setShowCompletionToast(true);
    setTimeout(() => setShowCompletionToast(false), 2500);

    // Auto-advance to next topic if available
    if (activeTopicIndex < currentTopics.length - 1) {
      setActiveTopicIndex(activeTopicIndex + 1);
    }
  };

  // Extract clean YouTube embed ID safely from any URL format
  const youtubeVideoId = useMemo(() => {
    if (!activeTopic?.video_url) return 'W6NZfCO5SIk';
    const str = String(activeTopic.video_url).trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
    const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : 'W6NZfCO5SIk';
  }, [activeTopic]);

  if (status === 'PENDING' && !currentCourse) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0056D2] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-300">Loading course player...</p>
        </div>
      </div>
    );
  }

  const courseTitle = currentCourse?.title || "Modern JavaScript & Architecture";

  return (
    <div className="h-screen max-h-screen w-full flex flex-col overflow-hidden bg-[#f8fafc] text-gray-900 font-sans">
      
      {/* ─── EXACT TOP BAR MATCHING ATTACHED SCREENSHOT ─── */}
      <header className="shrink-0 z-40 w-full bg-white border-b border-gray-200 px-4 sm:px-6 h-18 flex items-center justify-between shadow-xs">
        
        {/* Left: Organization Logos & Course Title with Progress */}
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          
          {/* Brand Logos */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-[#0056D2] flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-black tracking-tight text-[#07101e] block leading-tight">
                NACOS UPSKILL
              </span>
              <span className="text-[10px] font-semibold text-gray-400 font-mono">
                FUTO ECOSYSTEM
              </span>
            </div>
          </Link>

          <div className="h-8 w-px bg-gray-200 hidden sm:block" />

          {/* Course Title + Orange Progress Bar exactly like image */}
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {courseTitle}
            </h1>
            
            {/* Progress track */}
            <div className="flex items-center gap-3 mt-1.5">
              <div className="w-36 sm:w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(4, progressPercent)}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-gray-600 font-sans whitespace-nowrap">
                {progressPercent}% Learnt
              </span>
            </div>
          </div>

        </div>

        {/* Right Action Buttons: "Course Page", "My courses", and Hamburger Icon */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/courses"
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-2xs transition-colors"
          >
            Course Page
          </Link>

          <Link
            to="/my-learning"
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg shadow-2xs transition-colors"
          >
            My courses
          </Link>

          {/* Hamburger Menu Toggle (Curriculum Sidebar) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 border border-gray-300 transition-colors cursor-pointer"
            title={sidebarOpen ? "Hide syllabus sidebar" : "Show syllabus sidebar"}
            aria-label="Toggle Syllabus"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

      </header>

      {/* ─── MAIN CONTENT VIEW (VIDEO PLAYER + RIGHT SYLLABUS SIDEBAR) ─── */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full">
        
        {/* LEFT / CENTER: VIDEO PLAYER & LESSON NOTES */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-gray-950 flex flex-col justify-between overscroll-contain">
          
          {/* Video Player Frame - Fits Edge-to-Edge into Frame */}
          <div className="w-full bg-black border-b border-gray-800">
            <div className="w-full aspect-video relative bg-black">
              <iframe
                key={youtubeVideoId}
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
                title={activeTopic?.title || "Course Video"}
                className="w-full h-full border-0 block"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="eager"
              />
            </div>
          </div>

          {/* Video Footer Action Strip */}
          <div className="bg-white border-t border-gray-200 p-4 sm:p-6 text-gray-900">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-[#0056D2] uppercase tracking-wider block mb-1">
                  Topic {activeTopicIndex + 1} of {currentTopics.length || 1}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                  {activeTopic?.title || 'Interactive Course Overview'}
                </h2>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                  <span>Duration: {activeTopic?.duration || '15:00'}</span>
                  <span>•</span>
                  <span>Category: {currentCourse?.tags?.[0] || 'Technical Skill'}</span>
                </p>
              </div>

              {/* Complete Topic Action Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMarkComplete}
                  className="px-6 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0043aa] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark as Complete</span>
                </button>
              </div>
            </div>

            {/* Topic Summary & Learner Notes */}
            <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Summary */}
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Lesson Summary & Educational Objectives
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {activeTopic?.summary_text || currentCourse?.description || "In this module, you will gain hands-on architectural experience, study best practices, and implement key features with step-by-step guidance."}
                </p>
              </div>

              {/* Live Topic Note Taker */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>Quick Lesson Notes</span>
                </h4>
                <textarea
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Type personal takeaways or code notes..."
                  className="w-full h-24 p-2.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0056D2] resize-none"
                />
                <button
                  onClick={() => alert('Note saved to your session!')}
                  className="w-full py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Save Note
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* ─── RIGHT: ACCORDION SYLLABUS SIDEBAR MATCHING ATTACHED SCREENSHOT ─── */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-white border-l border-gray-200 flex flex-col shrink-0 h-full overflow-hidden min-h-0 z-30 shadow-lg animate-in slide-in-from-right duration-200">
            
            {/* Top Navigation Tabs: Content | Quizzes | Certificates */}
            <div className="border-b border-gray-200 flex items-center justify-around px-2 pt-3 shrink-0">
              <button
                onClick={() => setActiveTab('content')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'content'
                    ? 'text-sky-600 border-sky-600'
                    : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Content</span>
              </button>

              <button
                onClick={() => setActiveTab('quizzes')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'quizzes'
                    ? 'text-sky-600 border-sky-600'
                    : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quizzes</span>
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                className={`pb-3 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'certificates'
                    ? 'text-sky-600 border-sky-600'
                    : 'text-gray-500 border-transparent hover:text-gray-900'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Certificates</span>
              </button>
            </div>

            {/* TAB 1: CONTENT (ACCORDION MODULES MATCHING SCREENSHOT) */}
            {activeTab === 'content' && (
              <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 overscroll-contain">
                {modules.map((mod, modIdx) => {
                  const isExpanded = Boolean(expandedModules[modIdx]);
                  const modTopicCount = mod.topics.length;
                  const modPassedCount = mod.topics.filter(t => completedTopicIds.includes(t.id)).length;
                  const isModCompleted = modPassedCount === modTopicCount && modTopicCount > 0;

                  return (
                    <div 
                      key={mod.id} 
                      className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                    >
                      {/* Module Accordion Header */}
                      <button
                        onClick={() => handleToggleModule(modIdx)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Circular Blue Icon exactly as in screenshot */}
                          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shrink-0">
                            <LayoutGrid className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug truncate">
                              {mod.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mt-0.5">
                              {isModCompleted ? (
                                <span className="inline-flex items-center gap-1 text-sky-600 font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5 fill-sky-600 text-white" />
                                  <span>{modPassedCount}/{modTopicCount} passed</span>
                                </span>
                              ) : (
                                <span className="text-gray-500">
                                  {modPassedCount}/{modTopicCount} passed
                                </span>
                              )}
                              <span>•</span>
                              <span>{modTopicCount} Topics</span>
                            </div>
                          </div>
                        </div>

                        {/* Chevron Toggle */}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </button>

                      {/* Expanded Topics List */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 divide-y divide-gray-100 p-2 space-y-1">
                          {mod.topics.map((topic) => {
                            const globalIndex = currentTopics.findIndex(t => t.id === topic.id);
                            const isActive = globalIndex === activeTopicIndex;
                            const isTopicCompleted = completedTopicIds.includes(topic.id);

                            return (
                              <button
                                key={topic.id}
                                onClick={() => handleSelectTopic(globalIndex)}
                                className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                                  isActive
                                    ? 'bg-sky-50 text-sky-900 border border-sky-300 shadow-2xs font-semibold'
                                    : 'hover:bg-gray-50 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {/* Item Icon */}
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isActive
                                      ? 'bg-sky-600 text-white'
                                      : isTopicCompleted
                                      ? 'bg-gray-100 text-sky-600'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {isActive ? (
                                      <Play className="w-3.5 h-3.5 fill-white" />
                                    ) : (
                                      <LayoutGrid className="w-3.5 h-3.5" />
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold leading-snug truncate">
                                      {topic.title}
                                    </p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                      Video · {topic.duration || '12:30'}
                                    </p>
                                  </div>
                                </div>

                                {/* Completion Checkmark */}
                                {isTopicCompleted && (
                                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 ml-2" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: QUIZZES */}
            {activeTab === 'quizzes' && (
              <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 overscroll-contain">
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-950">
                  <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Knowledge Checks</h4>
                  <p className="text-xs text-sky-800">
                    Test your understanding after completing modules to unlock your graduation certificate.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-bold text-gray-900">Module 1 Assessment</p>
                  <p className="text-[11px] text-gray-500">5 Multiple Choice Questions · 80% passing mark</p>
                  <button 
                    onClick={() => alert('Quiz simulation: Congratulations, you passed with 100%!')}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="flex-1 overflow-y-auto min-h-0 p-4 text-center space-y-4 overscroll-contain">
                <div className="p-6 border border-gray-200 rounded-2xl bg-gray-50">
                  <Award className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-gray-900">Certificate of Completion</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Issued by NACOS FUTO Academic Board upon 100% course completion.
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-700 mb-2">
                      Current Progress: {progressPercent}%
                    </p>
                    <button
                      disabled={progressPercent < 100}
                      className="w-full py-2.5 rounded-xl bg-[#0056D2] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                    >
                      {progressPercent >= 100 ? 'Claim Verified Certificate' : 'Complete All Modules to Unlock'}
                    </button>
                  </div>
                </div>
              </div>
            )}

          </aside>
        )}

      </div>

      {/* Completion Toast Notification */}
      {showCompletionToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#0056D2] text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-white/20 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-bold">Topic marked as complete! Progress updated.</span>
        </div>
      )}

    </div>
  );
};

export default CourseDetailPage;

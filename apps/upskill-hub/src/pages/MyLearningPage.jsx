import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  Video, 
  ArrowRight, 
  Sparkles,
  BarChart3,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCourseStore } from '../stores/courseStore';

const MyLearningPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { allCourses, fetchAllCourses, userEnrollments, fetchUserEnrollments } = useCourseStore();
  const [activeTab, setActiveTab] = useState('in-progress');

  useEffect(() => {
    fetchAllCourses();
    if (user?.id) {
      fetchUserEnrollments(user.id);
    }
  }, [user?.id]);

  // Derive enrolled courses with progress
  const enrolledCourses = allCourses.map((course) => {
    const enrollment = userEnrollments.find((e) => e.course_id === course.id);
    const progress = enrollment?.progress_percentage || 0;
    const isCompleted = progress >= 100;
    return {
      ...course,
      enrolled: !!enrollment,
      progress,
      isCompleted,
      enrollmentId: enrollment?.id,
      completedTopics: enrollment?.completed_topic_ids || [],
    };
  }).filter((c) => c.enrolled);

  // Active / in-progress courses
  const inProgressCourses = enrolledCourses.filter((c) => !c.isCompleted);
  const completedCourses = enrolledCourses.filter((c) => c.isCompleted);

  // Fallback demo courses if user hasn't enrolled yet so dashboard is alive
  const displayInProgress = inProgressCourses.length > 0 
    ? inProgressCourses 
    : allCourses.slice(0, 2).map((c, i) => ({ ...c, progress: i === 0 ? 65 : 30, isCompleted: false }));

  const activeCourseSpotlight = displayInProgress[0];

  const displayName = user?.user_metadata?.full_name || 'Scholar';
  const isNacosStudent = user?.isNacosStudent || user?.user_metadata?.is_nacos_student;
  const matricNo = user?.user_metadata?.matric_number;

  return (
    <div className="min-h-screen bg-[#041801] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Banner & KPI Metrics */}
        <div className="bg-gradient-to-r from-[#083002] via-[#0b4203] to-[#083002] border border-[#138601]/40 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#138601]/25 border border-[#138601]/40 text-[#4bd043] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Learner Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Welcome back, {displayName}!
              </h1>
              <p className="text-xs sm:text-sm text-green-100/70 mt-1">
                {isNacosStudent ? `NACOS Scholar (${matricNo || 'Department of Computer Science'})` : 'Continuous Tech Skills & Learning Track'}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
              <div className="bg-[#041801]/70 border border-[#138601]/30 rounded-xl p-3.5 text-center min-w-[90px]">
                <p className="text-xl sm:text-2xl font-black text-[#4bd043]">
                  {displayInProgress.length}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400">In Progress</p>
              </div>

              <div className="bg-[#041801]/70 border border-[#138601]/30 rounded-xl p-3.5 text-center min-w-[90px]">
                <p className="text-xl sm:text-2xl font-black text-amber-400">
                  {completedCourses.length || '1'}
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Completed</p>
              </div>

              <div className="bg-[#041801]/70 border border-[#138601]/30 rounded-xl p-3.5 text-center min-w-[90px]">
                <p className="text-xl sm:text-2xl font-black text-emerald-400">
                  14.5
                </p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Hours Learnt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Learning Hero Card (Coursera-style Spotlight) */}
        {activeCourseSpotlight && (
          <div className="bg-[#083002] border border-[#138601]/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <img
                  src={activeCourseSpotlight.thumbnail}
                  alt={activeCourseSpotlight.title}
                  className="w-24 h-20 sm:w-32 sm:h-24 object-cover rounded-xl border border-[#138601]/30 shrink-0"
                />
                <div>
                  <span className="text-[11px] font-bold text-[#4bd043] uppercase tracking-wider block mb-1">
                    Resume Where You Left Off
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                    {activeCourseSpotlight.title}
                  </h3>
                  <div className="w-full max-w-md">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                      <span>Course Progress</span>
                      <span className="font-bold text-[#4bd043]">{activeCourseSpotlight.progress}% completed</span>
                    </div>
                    <div className="w-full h-2 bg-[#041801] rounded-full overflow-hidden border border-[#138601]/20">
                      <div 
                        className="h-full bg-gradient-to-r from-[#138601] to-[#4bd043] rounded-full transition-all duration-500" 
                        style={{ width: `${Math.max(5, activeCourseSpotlight.progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={() => navigate(`/courses/${activeCourseSpotlight.id}`)}
                  className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume Learning</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-[#138601]/25 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors border-b-2 cursor-pointer ${
              activeTab === 'in-progress'
                ? 'text-[#4bd043] border-[#4bd043]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            In Progress ({displayInProgress.length})
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors border-b-2 cursor-pointer ${
              activeTab === 'completed'
                ? 'text-[#4bd043] border-[#4bd043]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Completed ({completedCourses.length})
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-3 text-sm font-bold tracking-tight transition-colors border-b-2 cursor-pointer ${
              activeTab === 'resources'
                ? 'text-[#4bd043] border-[#4bd043]'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
          >
            Saved Academic Resources
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'in-progress' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayInProgress.map((course) => (
              <div
                key={course.id}
                className="bg-[#083002] border border-[#138601]/30 hover:border-[#138601] rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-[#138601]/20">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-xs border border-white/20">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-[#4bd043] transition-colors leading-snug mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-green-100/70 line-clamp-2 mb-4 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#138601]/20">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                    <span>Progress</span>
                    <span className="font-bold text-[#4bd043]">{course.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#041801] rounded-full overflow-hidden mb-4">
                    <div 
                      className="h-full bg-[#138601] rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <button
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#041801] hover:bg-[#138601] text-xs font-semibold text-white border border-[#138601]/40 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Go to Course</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="bg-[#083002]/60 border border-[#138601]/30 rounded-2xl p-8 text-center py-12">
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Foundational Web Architecture</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
              Completed 100% · Certificate of Completion generated on September 2026.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#138601] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#0f6c01]">
              <Award className="w-4 h-4" />
              <span>Download Digital Certificate</span>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-[#083002]/60 border border-[#138601]/30 rounded-2xl p-8 text-center py-12">
            <BookOpen className="w-12 h-12 text-[#138601] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Curriculum Resource Hub</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto mb-6">
              Access your department syllabus, course codes, lecture slides, and past questions anytime.
            </p>
            <Link
              to="/resources"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-xs font-bold shadow-md transition-colors"
            >
              <span>Explore All Academic Resources</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyLearningPage;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  Play, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Award, 
  Users, 
  ArrowRight,
  TrendingUp,
  Code2,
  Cpu,
  ShieldCheck,
  Cloud
} from "lucide-react";
import { useCourseStore } from "../stores/courseStore";
import { useAuthStore } from "../stores/authStore";

const HomePage = () => {
  const navigate = useNavigate();
  const { allCourses, fetchAllCourses } = useCourseStore();
  const { user, isAuthenticated } = useAuthStore();
  const [selectedTag, setSelectedTag] = useState("all");
  const [heroSearch, setHeroSearch] = useState("");

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/courses?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const categories = [
    { label: "All Topics", tag: "all" },
    { label: "Web Development", tag: "web-dev" },
    { label: "Python & AI", tag: "python" },
    { label: "Frontend React", tag: "frontend" },
    { label: "Backend & APIs", tag: "backend" },
    { label: "Data Science", tag: "data-science" },
  ];

  const filteredCourses = selectedTag === "all"
    ? allCourses
    : allCourses.filter(c => c.tags?.includes(selectedTag));

  const liveWorkshops = allCourses.filter(c => c.is_live_workshop);

  return (
    <div className="min-h-screen bg-[#041801] text-white">
      
      {/* ─── 1. HERO SECTION (Coursera Style) ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-[#138601]/25 bg-gradient-to-b from-[#083002] via-[#041801] to-[#041801]">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#13860110_1px,transparent_1px),linear-gradient(to_bottom,#13860110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#138601]/20 border border-[#138601]/40 text-[#4bd043] text-xs font-bold uppercase tracking-wider animate-in fade-in">
            <Sparkles className="w-4 h-4 text-[#4bd043]" />
            <span>NACOS FUTO Learning & Upskill Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Learn Without Limits. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4bd043] via-[#138601] to-[#4bd043]">
              Master In-Demand Tech Skills.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-green-100/75 max-w-2xl mx-auto leading-relaxed">
            Curated developer courses, real-time code modules, hands-on lab workshops, and AI curriculum generators built specifically for NACOS computing scholars.
          </p>

          {/* Coursera Search Box */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto relative pt-4">
            <div className="flex items-center bg-[#083002] border-2 border-[#138601]/50 rounded-2xl p-2 shadow-2xl focus-within:border-[#4bd043] transition-colors">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                placeholder="What skill do you want to learn? (e.g. React, Python, Cybersecurity, APIs...)"
                className="w-full px-4 py-2.5 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#138601] hover:bg-[#0f6c01] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Popular Topics Quick Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <span className="font-semibold text-gray-300">Popular:</span>
              {['React 19', 'Python AI', 'Next.js', 'Machine Learning', 'Node.js Microservices'].map(term => (
                <button
                  key={term}
                  type="button"
                  onClick={() => navigate(`/courses?search=${encodeURIComponent(term)}`)}
                  className="px-2.5 py-1 rounded-full bg-[#041801] border border-[#138601]/30 hover:border-[#4bd043] hover:text-white transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </form>

          {/* Quick Dual Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {!isAuthenticated ? (
              <Link
                to="/sign-up"
                className="px-7 py-3 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-sm font-bold shadow-lg transition-transform transform hover:-translate-y-0.5"
              >
                Join for Free
              </Link>
            ) : (
              <Link
                to="/my-learning"
                className="px-7 py-3 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-sm font-bold shadow-lg transition-transform transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Go to My Learning</span>
              </Link>
            )}

            <Link
              to="/courses"
              className="px-7 py-3 rounded-xl bg-[#083002] hover:bg-[#0b4203] text-white text-sm font-bold border border-[#138601]/40 transition-colors"
            >
              Explore Catalog
            </Link>

            <Link
              to="/resources"
              className="px-7 py-3 rounded-xl bg-[#083002] hover:bg-[#0b4203] text-[#4bd043] text-sm font-bold border border-[#138601]/40 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum Notes</span>
            </Link>
          </div>

          {/* Platform Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-[#138601]/20">
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-white">1,200+</p>
              <p className="text-xs text-gray-400 uppercase font-semibold">Active Scholars</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-[#4bd043]">100% Free</p>
              <p className="text-xs text-gray-400 uppercase font-semibold">For NACOS FUTO</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-amber-400">Interactive</p>
              <p className="text-xs text-gray-400 uppercase font-semibold">Video Course Studio</p>
            </div>
            <div className="p-3">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">AI Powered</p>
              <p className="text-xs text-gray-400 uppercase font-semibold">Curriculum Engine</p>
            </div>
          </div>

        </div>
      </section>

      {/* ─── 2. FEATURED COURSES CATALOG ─── */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Explore Top <span className="text-[#4bd043]">Learning Tracks</span>
            </h2>
            <p className="text-xs sm:text-sm text-green-100/70 mt-1">
              Start with fundamentals or dive deep into production-grade systems.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.tag}
                onClick={() => setSelectedTag(cat.tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer border ${
                  selectedTag === cat.tag
                    ? "bg-[#138601] text-white border-[#138601]"
                    : "bg-[#083002] text-gray-300 border-[#138601]/30 hover:border-[#138601] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 6).map((course) => (
            <div
              key={course.id}
              className="bg-[#083002] border border-[#138601]/30 hover:border-[#138601] rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl group cursor-pointer"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-xs border border-white/20">
                      {course.level}
                    </span>
                    {course.is_live_workshop && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/80 text-black font-semibold">
                        Workshop
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {course.tags?.map((t) => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#138601]/20 text-[#4bd043] border border-[#138601]/30">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#4bd043] transition-colors leading-snug mb-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-green-100/70 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-[#138601]/20 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Self-Paced Track</span>
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-[#4bd043] group-hover:translate-x-1 transition-transform">
                    <span>Learn Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#083002] hover:bg-[#0b4203] text-white text-xs sm:text-sm font-bold border border-[#138601]/40 transition-colors shadow-md"
          >
            <span>View All Courses & Tracks</span>
            <ArrowRight className="w-4 h-4 text-[#4bd043]" />
          </Link>
        </div>
      </section>

      {/* ─── 3. WHY LEARN ON NACOS UPSKILL HUB ─── */}
      <section className="bg-[#083002]/60 border-y border-[#138601]/25 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-black text-white">
              Why Learn on <span className="text-[#4bd043]">NACOS Upskill Hub?</span>
            </h2>
            <p className="text-xs sm:text-sm text-green-100/70 mt-2">
              Engineered exclusively for computing undergraduates and aspiring software professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#041801] border border-[#138601]/30 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#138601]/20 flex items-center justify-center text-[#4bd043] mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Synchronized Syllabus</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Matches the departmental curriculum from 100L through 500L while teaching modern production tools.
              </p>
            </div>

            <div className="bg-[#041801] border border-[#138601]/30 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#138601]/20 flex items-center justify-center text-[#4bd043] mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Hands-on Code Projects</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Build real-world portfolios with React, Python, APIs, and cloud services to stand out for internships.
              </p>
            </div>

            <div className="bg-[#041801] border border-[#138601]/30 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#138601]/20 flex items-center justify-center text-[#4bd043] mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Coding Workshops</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Participate in live weekend bootcamps led by alumni and senior scholars at the FUTO ICT Innovation Center.
              </p>
            </div>

            <div className="bg-[#041801] border border-[#138601]/30 rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-[#138601]/20 flex items-center justify-center text-[#4bd043] mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Verified Skill Badges</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Earn certificates and badges directly verifiable by recruiters and departmental officials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. UPCOMING WORKSHOPS TEASER ─── */}
      {liveWorkshops.length > 0 && (
        <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Upcoming Live <span className="text-amber-400">Workshops</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                RSVP for interactive hands-on developer workshops on campus and virtually.
              </p>
            </div>
            <Link
              to="/workshops"
              className="text-xs font-bold text-[#4bd043] hover:underline flex items-center gap-1"
            >
              <span>See All Workshops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liveWorkshops.map((w) => (
              <div
                key={w.id}
                className="bg-[#083002] border border-[#138601]/30 rounded-2xl p-6 flex flex-col justify-between hover:border-[#138601] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Live Hands-on
                    </span>
                    <span className="text-xs text-gray-400">
                      {w.workshop_details?.date} · {w.workshop_details?.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{w.title}</h3>
                  <p className="text-xs text-green-100/70 mb-4">{w.description}</p>
                  
                  <div className="p-3 bg-[#041801] rounded-xl border border-[#138601]/20 text-xs text-gray-300 mb-4">
                    <span className="font-semibold text-white">Venue: </span>
                    {w.workshop_details?.location}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/courses/${w.id}`)}
                  className="w-full py-2.5 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  View Details & Register
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── 5. CALL TO ACTION FOR CREATORS ─── */}
      <section className="max-w-7xl mx-auto pb-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0b4203] via-[#083002] to-[#041801] border border-[#138601]/50 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-[#138601]/30 border border-[#138601]/40 text-[#4bd043] text-xs font-bold uppercase">
              Creator Studio
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Are you passionate about teaching tech?
            </h2>
            <p className="text-xs sm:text-sm text-green-100/75 leading-relaxed">
              Create video modules, publish interactive curriculums generated by Gemini AI, and mentor fellow scholars across the department.
            </p>
          </div>

          <Link
            to="/create-course"
            className="px-8 py-3.5 rounded-xl bg-[#138601] hover:bg-[#0f6c01] text-white text-xs sm:text-sm font-bold shadow-xl transition-all transform hover:-translate-y-0.5 shrink-0 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>Launch Creator Studio</span>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, Sparkles, BookOpen, Video, ArrowRight, Award, Users } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { CourseCard } from "../components/courses/CourseCard";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { CourseLoading } from "../components/loading/CourseLoading";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const allCourses = useCourseStore((state) => state.allCourses);
  const userEnrollments = useCourseStore((state) => state.userEnrollments);
  const status = useCourseStore((state) => state.status);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);
  const fetchUserEnrollments = useCourseStore((state) => state.fetchUserEnrollments);

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchAllCourses();
    if (user?.id) {
      fetchUserEnrollments(user.id);
    }
  }, [fetchAllCourses, fetchUserEnrollments, user]);

  if (status === "PENDING" && allCourses.length === 0) {
    return (
      <Layout>
        <CourseLoading />
      </Layout>
    );
  }

  const liveWorkshops = allCourses.filter((c) => c.is_live_workshop);
  const selfPacedCourses = allCourses.filter((c) => !c.is_live_workshop);

  const displayedCourses = activeTab === "workshops"
    ? liveWorkshops
    : activeTab === "courses"
    ? selfPacedCourses
    : allCourses;

  return (
    <Layout>
      <div className="space-y-8 font-sans">
        {/* Hero Welcome Banner */}
        <div className="p-6 sm:p-8 rounded-xl bg-gradient-to-br from-[#083002] via-[#0b4203] to-[#041801] text-white border border-[#138601]/40 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#138601]/25 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#138601]/40 text-[#4bd043] border border-[#138601]/50 text-xs font-mono font-semibold">
              <Sparkles size={12} />
              <span>Upskill Hub • NACOS FUTO</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Elevate Your Tech & Engineering Skills
            </h1>

            <p className="text-sm text-green-100/80 leading-relaxed">
              Curated masterclasses, AI-assisted video courses, and live peer workshops built for Computer Science undergraduates and tech enthusiasts.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link to="/courses">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#4bd043] text-[#083002] hover:bg-[#3ebe36] transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <BookOpen size={14} />
                  <span>Browse Tracks</span>
                  <ArrowRight size={14} />
                </button>
              </Link>

              <Link to="/workshops">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20 cursor-pointer flex items-center gap-2"
                >
                  <Video size={14} />
                  <span>Live Workshops</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick KPI Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BrutalCard className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-mono">Total Tracks</span>
              <BookOpen size={14} className="text-[#138601]" />
            </div>
            <div className="text-xl font-bold">{allCourses.length}</div>
          </BrutalCard>

          <BrutalCard className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-mono">Live Workshops</span>
              <Video size={14} className="text-amber-500" />
            </div>
            <div className="text-xl font-bold">{liveWorkshops.length}</div>
          </BrutalCard>

          <BrutalCard className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-mono">Your Enrollments</span>
              <Award size={14} className="text-[#138601]" />
            </div>
            <div className="text-xl font-bold">{userEnrollments.length}</div>
          </BrutalCard>

          <BrutalCard className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-mono">Active Scholars</span>
              <Users size={14} className="text-blue-500" />
            </div>
            <div className="text-xl font-bold">1,400+</div>
          </BrutalCard>
        </div>

        {/* Course Catalog Filter Tabs */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={18} className="text-[#138601]" />
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Featured Learning Modules
              </h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-secondary/80 border border-border self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-foreground text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All ({allCourses.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("courses")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "courses"
                    ? "bg-foreground text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Courses ({selfPacedCourses.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("workshops")}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "workshops"
                    ? "bg-foreground text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Workshops ({liveWorkshops.length})
              </button>
            </div>
          </div>

          {/* Grid of Courses */}
          {displayedCourses.length === 0 ? (
            <BrutalCard className="text-center py-12 space-y-2">
              <p className="font-bold text-sm">No courses found in this category.</p>
              <p className="text-xs text-muted-foreground">Check back soon for new tracks or create one!</p>
            </BrutalCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedCourses.map((course) => {
                const enrollment = userEnrollments.find(
                  (e) => String(e.course_id) === String(course.id)
                );
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrolled={!!enrollment}
                    progress={enrollment?.progress || 0}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default HomePage;

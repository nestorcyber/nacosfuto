import React, { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Plus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { CourseCard } from "../components/courses/CourseCard";
import { BrutalCard } from "../components/ui/BrutalCard";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";

export function MyCoursesPage() {
  const user = useAuthStore((state) => state.user);
  const allCourses = useCourseStore((state) => state.allCourses);
  const userEnrollments = useCourseStore((state) => state.userEnrollments);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);
  const fetchUserEnrollments = useCourseStore((state) => state.fetchUserEnrollments);

  const [tab, setTab] = useState("enrolled"); // 'enrolled' | 'created'

  useEffect(() => {
    fetchAllCourses();
    if (user?.id) {
      fetchUserEnrollments(user.id);
    }
  }, [fetchAllCourses, fetchUserEnrollments, user]);

  const enrolledCourseIds = userEnrollments.map((e) => String(e.course_id));
  const enrolledCourses = allCourses.filter((c) => enrolledCourseIds.includes(String(c.id)));
  const createdCourses = allCourses.filter(
    (c) => c.creator_id && String(c.creator_id) === String(user?.id)
  );

  const displayedCourses = tab === "created" ? createdCourses : enrolledCourses;

  return (
    <Layout>
      <div className="space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#138601]/10 text-[#138601]">
                <GraduationCap size={16} />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                My Learning & Creations
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Track your ongoing modules, resume video lessons, and manage courses you published.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("enrolled")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all border ${
                tab === "enrolled"
                  ? "bg-foreground text-primary-foreground border-foreground shadow-xs"
                  : "bg-secondary text-foreground border-border hover:bg-muted"
              }`}
            >
              Enrolled Tracks ({enrolledCourses.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("created")}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all border ${
                tab === "created"
                  ? "bg-foreground text-primary-foreground border-foreground shadow-xs"
                  : "bg-secondary text-foreground border-border hover:bg-muted"
              }`}
            >
              My Created ({createdCourses.length})
            </button>
          </div>
        </div>

        {displayedCourses.length === 0 ? (
          <BrutalCard className="text-center py-16 space-y-3">
            <p className="font-bold text-base text-foreground">
              {tab === "created"
                ? "You haven't authored any courses yet."
                : "You haven't enrolled in any courses yet."}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              {tab === "created"
                ? "Use the Creator Studio to design a new track or host a live workshop for your peers."
                : "Explore our collection of self-paced courses and start learning today."}
            </p>
            {tab === "created" ? (
              <Link to="/create-course">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-[#138601] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <Plus size={14} />
                  <span>Create Course</span>
                </button>
              </Link>
            ) : (
              <Link to="/courses">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-foreground text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <BookOpen size={14} />
                  <span>Browse Tracks</span>
                </button>
              </Link>
            )}
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
      </div>
    </Layout>
  );
}

export default MyCoursesPage;

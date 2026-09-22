import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, BookOpen, Sparkles, RotateCcw } from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { CourseCard } from "../components/courses/CourseCard";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalTag } from "../components/ui/BrutalTag";
import { CourseLoading } from "../components/loading/CourseLoading";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";

export function CoursesPage() {
  const user = useAuthStore((state) => state.user);
  const allCourses = useCourseStore((state) => state.allCourses);
  const userEnrollments = useCourseStore((state) => state.userEnrollments);
  const status = useCourseStore((state) => state.status);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);
  const fetchUserEnrollments = useCourseStore((state) => state.fetchUserEnrollments);

  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  useEffect(() => {
    fetchAllCourses();
    if (user?.id) {
      fetchUserEnrollments(user.id);
    }
  }, [fetchAllCourses, fetchUserEnrollments, user]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set();
    allCourses.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => set.add(t));
      }
    });
    return Array.from(set);
  }, [allCourses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      // Level filter
      if (selectedLevel !== "all" && (course.level || "").toLowerCase() !== selectedLevel.toLowerCase()) {
        return false;
      }
      // Tag filter
      if (selectedTag !== "all" && (!course.tags || !course.tags.includes(selectedTag))) {
        return false;
      }
      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = (course.title || "").toLowerCase().includes(q);
        const matchDesc = (course.description || "").toLowerCase().includes(q);
        const matchTags = (course.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [allCourses, selectedLevel, selectedTag, search]);

  const resetFilters = () => {
    setSearch("");
    setSelectedLevel("all");
    setSelectedTag("all");
  };

  const hasActiveFilters = search.trim() !== "" || selectedLevel !== "all" || selectedTag !== "all";

  return (
    <Layout>
      <div className="space-y-6 font-sans">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#138601]/10 text-[#138601]">
              <BookOpen size={16} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Courses & Learning Tracks
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore industry-aligned computer science modules, fullstack development pathways, and machine learning tracks.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <BrutalCard className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tracks by title, technology, or topic..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-md border border-border bg-background outline-none focus:border-foreground"
              />
            </div>

            {/* Level Selector */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-mono">Level:</span>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 text-xs rounded-md border border-border bg-background text-foreground font-medium outline-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="professional">Professional</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-2.5 py-2 rounded-md border border-border bg-secondary hover:bg-muted text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  title="Reset filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Tag Pills */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/60">
              <span className="text-[11px] font-mono text-muted-foreground mr-1">Tags:</span>
              <BrutalTag
                interactive
                selected={selectedTag === "all"}
                onClick={() => setSelectedTag("all")}
              >
                All
              </BrutalTag>
              {allTags.map((tag) => (
                <BrutalTag
                  key={tag}
                  interactive
                  selected={selectedTag === tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? "all" : tag)}
                >
                  #{tag}
                </BrutalTag>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* Courses List */}
        {status === "PENDING" && allCourses.length === 0 ? (
          <CourseLoading />
        ) : filteredCourses.length === 0 ? (
          <BrutalCard className="text-center py-16 space-y-3">
            <p className="font-bold text-base text-foreground">No matching courses found</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any courses matching your filter criteria. Try adjusting your search term or level filter.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-md text-xs font-semibold bg-secondary hover:bg-muted border border-border cursor-pointer inline-flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Clear All Filters</span>
              </button>
            )}
          </BrutalCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => {
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

export default CoursesPage;

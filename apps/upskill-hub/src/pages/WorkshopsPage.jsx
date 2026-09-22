import React, { useEffect } from "react";
import { Video, Calendar, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { LevelBadge } from "../components/ui/LevelBadge";
import { useCourseStore } from "../stores/courseStore";

export function WorkshopsPage() {
  const allCourses = useCourseStore((state) => state.allCourses);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const workshops = allCourses.filter((c) => c.is_live_workshop);

  return (
    <Layout>
      <div className="space-y-6 font-sans">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#138601]/10 text-[#138601]">
              <Video size={16} />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Live Interactive Workshops
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Join instructor-led engineering bootcamps, real-time code reviews, and hands-on lab sessions at FUTO.
          </p>
        </div>

        {workshops.length === 0 ? (
          <BrutalCard className="text-center py-16 space-y-2">
            <p className="font-bold text-sm">No live workshops scheduled right now.</p>
            <p className="text-xs text-muted-foreground">Check back soon or create a workshop as a creator!</p>
          </BrutalCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {workshops.map((ws) => {
              const isEnded =
                ws.workshop_details?.date &&
                new Date(ws.workshop_details.date) < new Date();

              return (
                <BrutalCard key={ws.id} className="flex flex-col p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <LevelBadge level={ws.level} />
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                        isEnded
                          ? "bg-muted text-muted-foreground"
                          : "bg-[#138601] text-white"
                      }`}
                    >
                      {isEnded ? "Ended" : "Live Session"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground mb-1 leading-snug">
                      {ws.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {ws.description}
                    </p>
                  </div>

                  {ws.workshop_details && (
                    <div className="p-3 bg-secondary/60 rounded-md border border-border/70 space-y-1.5 font-mono text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#138601]" />
                        <span>
                          {ws.workshop_details.date} at {ws.workshop_details.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} className="text-[#138601]" />
                        <span>Duration: {ws.workshop_details.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#138601]" />
                        <span className="truncate">{ws.workshop_details.location}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 mt-auto border-t border-border flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {ws.tags?.map((t) => (
                        <span key={t} className="text-[10px] font-mono text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <Link to={`/courses/${ws.id}`}>
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-foreground text-primary-foreground hover:bg-foreground/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  </div>
                </BrutalCard>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default WorkshopsPage;

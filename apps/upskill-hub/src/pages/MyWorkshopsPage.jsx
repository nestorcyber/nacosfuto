import React, { useEffect, useState } from "react";
import { Video, Users, Check, Clock, Calendar, MapPin, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";

export function MyWorkshopsPage() {
  const user = useAuthStore((state) => state.user);
  const allCourses = useCourseStore((state) => state.allCourses);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);
  const workshopRoster = useCourseStore((state) => state.workshopRoster);
  const fetchWorkshopRoster = useCourseStore((state) => state.fetchWorkshopRoster);

  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const hostedWorkshops = allCourses.filter(
    (c) => c.is_live_workshop && (!c.creator_id || String(c.creator_id) === String(user?.id) || c.creator_id === "creator-1")
  );

  useEffect(() => {
    if (hostedWorkshops.length > 0 && !selectedWorkshop) {
      setSelectedWorkshop(hostedWorkshops[0]);
      fetchWorkshopRoster(hostedWorkshops[0].id);
    }
  }, [hostedWorkshops, selectedWorkshop, fetchWorkshopRoster]);

  const handleSelectWorkshop = (ws) => {
    setSelectedWorkshop(ws);
    fetchWorkshopRoster(ws.id);
  };

  return (
    <div className="site-container py-8 space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#0056D2]/10 text-[#0056D2]">
                <Video size={16} />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Workshop Roster & Attendee Operations
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Review confirmed registrations, monitor student notes, and manage live session participants.
            </p>
          </div>

          <Link to="/create-course">
            <BrutalButton variant="primary" size="sm">
              <Plus size={14} className="mr-1.5" />
              <span>Host New Workshop</span>
            </BrutalButton>
          </Link>
        </div>

        {hostedWorkshops.length === 0 ? (
          <BrutalCard className="text-center py-16 space-y-3">
            <p className="font-bold text-base text-foreground">No Live Workshops Hosted</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven't scheduled any live workshops yet. Create a workshop track in the Creator Studio.
            </p>
            <Link to="/create-course">
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-[#0056D2] text-white text-xs font-semibold cursor-pointer"
              >
                Schedule Workshop
              </button>
            </Link>
          </BrutalCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Workshop Picker List (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-muted-foreground">
                Your Scheduled Workshops ({hostedWorkshops.length})
              </h3>
              <div className="space-y-2">
                {hostedWorkshops.map((ws) => {
                  const isSelected = selectedWorkshop?.id === ws.id;
                  return (
                    <BrutalCard
                      key={ws.id}
                      interactive
                      onClick={() => handleSelectWorkshop(ws)}
                      className={`p-3.5 transition-all ${
                        isSelected
                          ? "border-[#0056D2] bg-[#0056D2]/5"
                          : "border-border hover:border-foreground/30"
                      }`}
                    >
                      <h4 className="font-bold text-sm text-foreground truncate mb-1">
                        {ws.title}
                      </h4>
                      {ws.workshop_details && (
                        <div className="text-[11px] font-mono text-muted-foreground space-y-0.5">
                          <p>{ws.workshop_details.date} • {ws.workshop_details.time}</p>
                          <p className="truncate">{ws.workshop_details.location}</p>
                        </div>
                      )}
                    </BrutalCard>
                  );
                })}
              </div>
            </div>

            {/* Selected Workshop Roster (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {selectedWorkshop && (
                <BrutalCard className="p-5 space-y-4">
                  <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">
                        {selectedWorkshop.title}
                      </h2>
                      <span className="text-xs font-mono text-muted-foreground">
                        {selectedWorkshop.workshop_details?.location || "Virtual Workshop"}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-secondary border border-border">
                      <Users size={12} className="text-[#0056D2]" />
                      <span>{workshopRoster.length} Registrations</span>
                    </span>
                  </div>

                  {workshopRoster.length === 0 ? (
                    <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground">No students registered yet.</p>
                      <p>When students click "Register for Workshop", they will show up on this roster.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {workshopRoster.map((r, i) => (
                        <div
                          key={r.id || i}
                          className="p-3.5 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold font-mono">Scholar #{i + 1}</span>
                              <span className="text-muted-foreground font-mono">({r.user_id})</span>
                            </div>
                            {r.student_note ? (
                              <p className="mt-1 text-muted-foreground italic line-clamp-1">
                                Note: "{r.student_note}"
                              </p>
                            ) : (
                              <p className="mt-1 text-muted-foreground italic">No notes added</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded bg-blue-600/10 text-[#0056D2] font-semibold flex items-center gap-1 font-mono">
                              <Check size={12} /> Confirmed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </BrutalCard>
              )}
            </div>
          </div>
        )}
      </div>
  );
}

export default MyWorkshopsPage;

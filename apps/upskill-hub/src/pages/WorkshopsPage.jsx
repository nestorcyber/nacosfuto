import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Video, Calendar, MapPin, Clock, ArrowRight, CheckCircle, Users } from "lucide-react";
import { useCourseStore } from "../stores/courseStore";
import { useAuthStore } from "../stores/authStore";

export function WorkshopsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const allCourses = useCourseStore((state) => state.allCourses);
  const fetchAllCourses = useCourseStore((state) => state.fetchAllCourses);
  const registerForWorkshop = useCourseStore((state) => state.registerForWorkshop);

  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    fetchAllCourses();
  }, [fetchAllCourses]);

  const workshops = (allCourses || []).filter((c) => c.is_live_workshop);

  const handleRegister = async (ws) => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    await registerForWorkshop(user.id, ws.id, {
      fullName: user.name || user.email,
      email: user.email,
    });
    setRegisteredIds((prev) => new Set([...prev, ws.id]));
    setSuccessToast(`Successfully registered for "${ws.title}"!`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="flex-1 w-full bg-[#F8FAFC] text-[#000000] transition-colors duration-300">
      
      {/* Toast */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded bg-white border border-[#0056D2] text-[#000000] shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-4 h-4 text-[#0056D2]" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* ─── Taskbar ─── */}
      <div className="bg-white border-b border-gray-200 py-3.5 px-4 sticky top-16 z-20 shadow-xs">
        <div className="site-container flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#0056D2] flex items-center justify-center text-white shadow-xs font-black text-sm">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-black text-[#000000] uppercase tracking-wider">
                Live Interactive Workshops
              </h1>
              <p className="text-[11px] text-[#0056D2] font-semibold">
                Departmental Bootcamps & Real-Time Code Reviews
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-[#0056D2] border border-blue-200">
            {workshops.length} Scheduled Sessions
          </span>
        </div>
      </div>

      {/* ─── Main Workshops List ─── */}
      <main className="site-container py-8 sm:py-10">
        {workshops.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded border border-dashed border-gray-300">
            <Video className="mx-auto text-4xl text-gray-400 mb-3" />
            <h3 className="text-base font-bold text-[#000000]">No live workshops scheduled right now</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Check back soon for upcoming departmental bootcamps or live engineering masterclasses!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workshops.map((ws) => {
              const details = ws.workshop_details || {};
              const isRegistered = registeredIds.has(ws.id);

              return (
                <div
                  key={ws.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-[#0056D2] flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Banner */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={ws.thumbnail || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop"}
                        alt={ws.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-black uppercase font-mono">
                          Live Bootcamp
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-white uppercase font-mono">
                          {ws.level || "Intermediate"}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-[#000000] leading-snug">
                          {ws.title}
                        </h2>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {ws.description}
                        </p>
                      </div>

                      {/* Schedule Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50/60 p-3 rounded-xl border border-blue-100 text-gray-700">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#0056D2]" />
                          <span>{details.date || "October 2026"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#0056D2]" />
                          <span>{details.time || "14:00 GMT+1"}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-[#0056D2] shrink-0" />
                          <span className="truncate">{details.location || "FUTO ICT Innovation Center"}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Users className="w-3.5 h-3.5 text-[#0056D2] shrink-0" />
                          <span>Instructor: <strong>{details.instructor || ws.creator_name || "NACOS Faculty"}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleRegister(ws)}
                        disabled={isRegistered}
                        className={`flex-1 py-2 px-4 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isRegistered
                            ? "bg-blue-50 text-[#0056D2] border border-blue-200"
                            : "bg-[#0056D2] hover:bg-[#0043aa] text-white shadow-xs"
                        }`}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-[#0056D2]" />
                            <span>Registered</span>
                          </>
                        ) : (
                          <span>Register for Session</span>
                        )}
                      </button>

                      <Link
                        to={`/courses/${ws.id}`}
                        className="py-2 px-3 rounded text-xs font-bold bg-gray-50 border border-gray-200 hover:bg-gray-100 text-[#000000] transition-colors"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}

export default WorkshopsPage;

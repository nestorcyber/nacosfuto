import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Check,
  Play,
  Lock,
  BookOpen,
  Video,
  Share2
} from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { CoursePlayer } from "../components/courses/CoursePlayer";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { BrutalTag } from "../components/ui/BrutalTag";
import { LevelBadge } from "../components/ui/LevelBadge";
import { CourseLoading } from "../components/loading/CourseLoading";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";
import { cn } from "../lib/utils";

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const currentCourse = useCourseStore((state) => state.currentCourse);
  const currentTopics = useCourseStore((state) => state.currentTopics);
  const currentEnrollment = useCourseStore((state) => state.currentEnrollment);
  const workshopRegistration = useCourseStore((state) => state.workshopRegistration);
  const status = useCourseStore((state) => state.status);

  const fetchCourseById = useCourseStore((state) => state.fetchCourseById);
  const fetchCurrentEnrollment = useCourseStore((state) => state.fetchCurrentEnrollment);
  const enrollInCourse = useCourseStore((state) => state.enrollInCourse);
  const markTopicComplete = useCourseStore((state) => state.markTopicComplete);
  const registerForWorkshop = useCourseStore((state) => state.registerForWorkshop);
  const fetchMyWorkshopRegistration = useCourseStore((state) => state.fetchMyWorkshopRegistration);
  const updateStudentNote = useCourseStore((state) => state.updateStudentNote);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (id) {
      fetchCourseById(id);
      if (user?.id) {
        fetchCurrentEnrollment(user.id, id);
        fetchMyWorkshopRegistration(user.id, id);
      }
    }
  }, [id, user, fetchCourseById, fetchCurrentEnrollment, fetchMyWorkshopRegistration]);

  useEffect(() => {
    if (workshopRegistration?.student_note !== undefined) {
      setNote(workshopRegistration.student_note || "");
    }
  }, [workshopRegistration]);

  if (status === "PENDING" && !currentCourse) {
    return (
      <Layout>
        <CourseLoading />
      </Layout>
    );
  }

  if (!currentCourse) {
    return (
      <Layout>
        <BrutalCard className="text-center py-16 space-y-3">
          <p className="font-bold text-base">Course Not Found</p>
          <p className="text-xs text-muted-foreground">The requested course track does not exist or has been archived.</p>
          <button
            type="button"
            onClick={() => navigate("/courses")}
            className="px-4 py-2 rounded-md bg-foreground text-primary-foreground text-xs font-semibold cursor-pointer"
          >
            Back to All Courses
          </button>
        </BrutalCard>
      </Layout>
    );
  }

  const isWorkshop = !!currentCourse.is_live_workshop;
  const isEnrolled = !!currentEnrollment;
  const isRegistered = !!workshopRegistration;
  const canAccessTopics = isWorkshop ? isRegistered : isEnrolled;

  const isTopicCompleted = (topicId) => {
    return currentEnrollment?.completed_topic_ids?.includes(topicId);
  };

  const handleCTA = async () => {
    if (!user?.id) return;
    setActionLoading(true);
    try {
      if (isWorkshop) {
        await registerForWorkshop(user.id, currentCourse.id, currentCourse.creator_id);
      } else {
        await enrollInCourse(user.id, currentCourse.id);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedTopic) return;
    await markTopicComplete(selectedTopic.id);
  };

  const handleNoteChange = (text) => {
    setNote(text);
    if (workshopRegistration?.id) {
      updateStudentNote(workshopRegistration.id, text);
    }
  };

  // If a topic is currently active, render Course Player
  if (selectedTopic) {
    return (
      <Layout>
        <CoursePlayer
          topic={selectedTopic}
          isCompleted={isTopicCompleted(selectedTopic.id)}
          onMarkComplete={handleMarkComplete}
          onBack={() => setSelectedTopic(null)}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 font-sans">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        {/* Main Course Header Hero Card */}
        <BrutalCard className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Thumbnail */}
            <div className="lg:w-1/3 shrink-0">
              <div className="aspect-video rounded-md overflow-hidden border border-border bg-muted">
                <img
                  src={currentCourse.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop"}
                  alt={currentCourse.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Meta and Details */}
            <div className="lg:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <LevelBadge level={currentCourse.level} />

                  {currentCourse.is_ai_generated && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium bg-foreground text-primary-foreground rounded">
                      <Sparkles size={10} className="mr-1 text-amber-300" /> AI Generated
                    </span>
                  )}

                  {isWorkshop && (
                    <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium bg-[#138601] text-white rounded">
                      <Video size={10} className="mr-1" /> Live Workshop
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
                  {currentCourse.title}
                </h1>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  {currentCourse.description}
                </p>

                {/* Workshop Information box */}
                {isWorkshop && currentCourse.workshop_details && (
                  <div className="bg-secondary/60 rounded-md p-3.5 mb-4 font-mono text-xs space-y-1.5 border border-border/80">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Calendar size={13} className="text-[#138601]" />
                      <span>{currentCourse.workshop_details.date} at {currentCourse.workshop_details.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Clock size={13} className="text-[#138601]" />
                      <span>Duration: {currentCourse.workshop_details.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <MapPin size={13} className="text-[#138601]" />
                      <span>{currentCourse.workshop_details.location}</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {currentCourse.tags && currentCourse.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {currentCourse.tags.map((t) => (
                      <BrutalTag key={t} variant="muted">#{t}</BrutalTag>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons & Progress Status */}
              <div className="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {isWorkshop ? (
                  !isRegistered ? (
                    <BrutalButton
                      variant="primary"
                      onClick={handleCTA}
                      isLoading={actionLoading}
                    >
                      <Video size={15} className="mr-1.5" />
                      <span>Register for Live Workshop</span>
                    </BrutalButton>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#138601] text-white rounded">
                        <Check size={14} /> Registered Participant
                      </span>
                    </div>
                  )
                ) : !isEnrolled ? (
                  <BrutalButton
                    variant="primary"
                    onClick={handleCTA}
                    isLoading={actionLoading}
                  >
                    <Play size={15} className="mr-1.5 fill-current" />
                    <span>Start Learning Track</span>
                  </BrutalButton>
                ) : (
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex-1 sm:w-48">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground font-mono">Curriculum Progress</span>
                        <span className="font-bold">{currentEnrollment?.progress || 0}%</span>
                      </div>
                      <div className="progress-brutal">
                        <div
                          className="progress-brutal-fill"
                          style={{ width: `${currentEnrollment?.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-[#138601] dark:text-[#4bd043] border border-[#138601]/25 rounded shrink-0">
                      <Check size={12} /> Active Student
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </BrutalCard>

        {/* Live Workshop Student Notes */}
        {isWorkshop && isRegistered && (
          <BrutalCard className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono">
                <BookOpen size={14} className="text-[#138601]" />
                <span>My Live Workshop Notes</span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">Auto-saved</span>
            </div>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="Record your takeaways, code snippets, and instructor remarks here..."
              className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md outline-none focus:border-foreground resize-none"
            />
          </BrutalCard>
        )}

        {/* Syllabus / Lessons Outline */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-2">
              <BookOpen size={16} className="text-[#138601]" />
              <span>Curriculum Content & Lessons ({currentTopics.length})</span>
            </h2>
            {!canAccessTopics && (
              <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                <Lock size={12} /> Enroll to unlock full videos
              </span>
            )}
          </div>

          {currentTopics.length === 0 ? (
            <BrutalCard className="text-center py-12 space-y-1">
              <p className="font-semibold text-sm">No topics added yet</p>
              <p className="text-xs text-muted-foreground">The creator is currently structuring lessons for this track.</p>
            </BrutalCard>
          ) : (
            <div className="space-y-2">
              {currentTopics.map((topic, index) => {
                const completed = isTopicCompleted(topic.id);
                return (
                  <BrutalCard
                    key={topic.id}
                    interactive={canAccessTopics}
                    onClick={() => canAccessTopics && setSelectedTopic(topic)}
                    className={cn(
                      "flex items-center gap-4 transition-all p-3.5",
                      !canAccessTopics && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs shrink-0 font-mono",
                        completed
                          ? "bg-[#138601] text-white"
                          : "bg-secondary text-foreground"
                      )}
                    >
                      {completed ? <Check size={14} /> : index + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate text-foreground">
                        {topic.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-mono">
                        Duration: {topic.duration || "15:00"}
                      </p>
                    </div>

                    {canAccessTopics ? (
                      <span className="p-1.5 rounded bg-secondary text-muted-foreground group-hover:text-foreground">
                        <Play size={14} className="fill-current text-[#138601]" />
                      </span>
                    ) : (
                      <Lock size={14} className="text-muted-foreground shrink-0" />
                    )}
                  </BrutalCard>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default CourseDetailPage;

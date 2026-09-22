import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  PlayCircle,
  X,
  Layers,
  Video,
  Check,
  AlertCircle
} from "lucide-react";
import { Layout } from "../components/layout/Layout";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { TopicEditor } from "../components/courses/TopicEditor";
import { useAuthStore } from "../stores/authStore";
import { useCourseStore } from "../stores/courseStore";
import { aiService } from "../services/geminiService";

export function CreateCoursePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const createCourseWithCurriculum = useCourseStore((state) => state.createCourseWithCurriculum);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("beginner");
  const [thumbnail, setThumbnail] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  // Live Workshop fields
  const [isWorkshop, setIsWorkshop] = useState(false);
  const [workshopDate, setWorkshopDate] = useState("");
  const [workshopTime, setWorkshopTime] = useState("");
  const [workshopDuration, setWorkshopDuration] = useState("2 hours");
  const [workshopLocation, setWorkshopLocation] = useState("FUTO ICT Center / Virtual");

  // Curriculum Topics State
  const [topics, setTopics] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [currentTopic, setCurrentTopic] = useState({
    title: "",
    summary_text: "",
    video_url: "",
    duration: "15:00",
    start_playing_at: 0,
    is_ai_generated: false,
  });

  // AI Modal & Loading States
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiVideoLinks, setAiVideoLinks] = useState("");
  const [aiAdditionalInfo, setAiAdditionalInfo] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Update current topic field
  const updateCurrentTopic = (field, val) => {
    setCurrentTopic((prev) => ({ ...prev, [field]: val }));
  };

  // Add or update topic
  const handleSaveTopic = () => {
    if (!currentTopic.title.trim()) return;

    if (editIndex !== null) {
      const updated = [...topics];
      updated[editIndex] = { ...currentTopic, order_index: editIndex + 1 };
      setTopics(updated);
      setEditIndex(null);
    } else {
      setTopics((prev) => [
        ...prev,
        { ...currentTopic, order_index: prev.length + 1 },
      ]);
    }

    // Reset current topic form
    setCurrentTopic({
      title: "",
      summary_text: "",
      video_url: "",
      duration: "15:00",
      start_playing_at: 0,
      is_ai_generated: false,
    });
  };

  const handleEditTopic = (index) => {
    setEditIndex(index);
    setCurrentTopic({ ...topics[index] });
  };

  const handleRemoveTopic = (index) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
    }
  };

  // AI Draft Notes for Current Topic
  const handleGenerateSummary = async () => {
    if (!currentTopic.title) return;
    setIsGeneratingSummary(true);
    try {
      const summary = `Detailed lesson on "${currentTopic.title}". Explores foundational mechanics, syntax paradigms, step-by-step implementation, and common pitfalls to avoid in production code.`;
      updateCurrentTopic("summary_text", summary);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Trigger Gemini AI Full Course Curriculum Generation
  const handleRunAiGeneration = async () => {
    if (!title.trim()) {
      setErrorMsg("Please specify a course title first before running AI curriculum generation.");
      setIsAiModalOpen(false);
      return;
    }

    setIsAiGenerating(true);
    setErrorMsg("");
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const generated = await aiService.generateCurriculum(
        title.trim(),
        description.trim(),
        level,
        tags,
        aiVideoLinks,
        aiAdditionalInfo
      );

      if (generated && generated.length > 0) {
        setTopics(generated);
        setIsAiModalOpen(false);
      }
    } catch (err) {
      setErrorMsg("AI Curriculum Generation was unable to complete. You can still add topics manually.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Publish course to database
  const handlePublishCourse = async () => {
    if (!title.trim()) {
      setErrorMsg("Course title is required.");
      return;
    }
    if (topics.length === 0) {
      setErrorMsg("Please add at least one lesson topic to your curriculum.");
      return;
    }

    setIsPublishing(true);
    setErrorMsg("");

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const courseData = {
        title: title.trim(),
        description: description.trim() || `Course track covering ${title.trim()}.`,
        level,
        thumbnail: thumbnail.trim() || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop",
        tags: tags.length > 0 ? tags : ["engineering", "tech"],
        creator_id: user?.id || "creator-1",
        is_ai_generated: topics.some((t) => t.is_ai_generated),
        is_live_workshop: isWorkshop,
        workshop_details: isWorkshop
          ? {
              date: workshopDate || "2026-10-20",
              time: workshopTime || "14:00",
              duration: workshopDuration || "2 hours",
              location: workshopLocation || "FUTO ICT Complex",
            }
          : null,
      };

      const result = await createCourseWithCurriculum(courseData, topics);
      if (result?.course?.id) {
        navigate(`/courses/${result.course.id}`);
      } else {
        navigate("/courses");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to publish course.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 font-sans max-w-6xl mx-auto">
        {/* Header with AI trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles size={20} className="text-[#138601]" />
              <span>Creator Studio: Design Course</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Structure a self-paced video track or live workshop, or let Gemini AI draft a verified syllabus for you.
            </p>
          </div>

          <BrutalButton
            variant="success"
            onClick={() => setIsAiModalOpen(true)}
            disabled={isAiGenerating}
          >
            <Sparkles size={14} className="mr-1.5" />
            <span>{isAiGenerating ? "Generating..." : "Generate Syllabus with AI"}</span>
          </BrutalButton>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Course Parameters (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrutalCard className="p-4 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider font-mono text-muted-foreground">
                1. Course Overview
              </h2>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-1 block">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Docker"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-border bg-background rounded-md outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-1 block">
                  Difficulty Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-border bg-background rounded-md outline-none focus:border-foreground font-medium cursor-pointer"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-1 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will scholars master in this pathway?"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-border bg-background rounded-md outline-none focus:border-foreground resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-1 block">
                  Cover Image Thumbnail URL
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md outline-none focus:border-foreground"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider mb-1 block">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="react, cloud, devops"
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md outline-none focus:border-foreground"
                />
              </div>
            </BrutalCard>

            {/* Live Workshop Settings */}
            <BrutalCard className="p-4 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isWorkshop}
                  onChange={(e) => setIsWorkshop(e.target.checked)}
                  className="w-4 h-4 rounded text-[#138601] focus:ring-[#138601]"
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Host as Live Workshop
                </span>
              </label>

              {isWorkshop && (
                <div className="space-y-2.5 pt-2 border-t border-border">
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-0.5">Date</label>
                    <input
                      type="date"
                      value={workshopDate}
                      onChange={(e) => setWorkshopDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-border bg-background rounded-md outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-0.5">Time</label>
                    <input
                      type="time"
                      value={workshopTime}
                      onChange={(e) => setWorkshopTime(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-border bg-background rounded-md outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-0.5">Duration</label>
                    <input
                      type="text"
                      value={workshopDuration}
                      onChange={(e) => setWorkshopDuration(e.target.value)}
                      placeholder="e.g. 2 hours"
                      className="w-full px-2.5 py-1.5 text-xs border border-border bg-background rounded-md outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-0.5">Location or Meeting URL</label>
                    <input
                      type="text"
                      value={workshopLocation}
                      onChange={(e) => setWorkshopLocation(e.target.value)}
                      placeholder="e.g. Hall B / Google Meet"
                      className="w-full px-2.5 py-1.5 text-xs border border-border bg-background rounded-md outline-none"
                    />
                  </div>
                </div>
              )}
            </BrutalCard>
          </div>

          {/* Right Column: Curriculum Lessons & TopicEditor (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Added Topics List */}
            {topics.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-muted-foreground">
                    Curriculum Modules ({topics.length})
                  </h3>
                  <span className="text-[11px] text-[#138601] font-semibold">
                    {topics.filter((t) => t.is_ai_generated).length} AI Curated
                  </span>
                </div>

                <div className="space-y-2">
                  {topics.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 transition-all ${
                        editIndex === idx
                          ? "bg-amber-500/10 border-amber-500/50"
                          : "bg-card border-border hover:border-foreground/30"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-md bg-secondary flex items-center justify-center font-bold text-xs font-mono shrink-0">
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-foreground truncate">
                            {t.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {t.summary_text}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-muted-foreground">
                            <span>Duration: {t.duration || "15:00"}</span>
                            {t.video_url && (
                              <span className="inline-flex items-center gap-1 text-[#138601]">
                                <PlayCircle size={11} />
                                Video Linked ({t.video_url.substring(0, 11)})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditTopic(idx)}
                          className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                          title="Edit module"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(idx)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-muted-foreground hover:text-red-500 cursor-pointer"
                          title="Remove module"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Topic Editor Component */}
            <TopicEditor
              currentTopic={currentTopic}
              editIndex={editIndex}
              isSearchingVideo={false}
              isGeneratingSummary={isGeneratingSummary}
              onUpdateField={updateCurrentTopic}
              onGenerateSummary={handleGenerateSummary}
              onSaveTopic={handleSaveTopic}
              onCancelEdit={() => {
                setEditIndex(null);
                setCurrentTopic({
                  title: "",
                  summary_text: "",
                  video_url: "",
                  duration: "15:00",
                  start_playing_at: 0,
                  is_ai_generated: false,
                });
              }}
            />

            {/* Publish Actions Bar */}
            <div className="pt-4 border-t border-border flex justify-end">
              <BrutalButton
                variant="primary"
                size="lg"
                onClick={handlePublishCourse}
                isLoading={isPublishing}
                disabled={!title.trim() || topics.length === 0}
              >
                <Plus size={16} className="mr-1.5" />
                <span>Publish Course ({topics.length} Lessons)</span>
              </BrutalButton>
            </div>
          </div>
        </div>

        {/* AI Generator Modal */}
        {isAiModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <BrutalCard className="w-full max-w-lg p-6 bg-card border border-border shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-[#138601]" />
                  <h3 className="font-bold text-base">Gemini AI Curriculum Generator</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Provide optional reference YouTube links or specific curriculum focus areas. Gemini AI will structure high-yield lesson modules with verified tutorial videos and detailed notes.
              </p>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1">
                  Reference YouTube Links / IDs (Optional)
                </label>
                <textarea
                  rows={2}
                  value={aiVideoLinks}
                  onChange={(e) => setAiVideoLinks(e.target.value)}
                  placeholder="e.g. https://youtube.com/watch?v=dQw4w9WgXcQ"
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md outline-none focus:border-foreground resize-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1">
                  Additional Rules or Guidelines (Optional)
                </label>
                <textarea
                  rows={2}
                  value={aiAdditionalInfo}
                  onChange={(e) => setAiAdditionalInfo(e.target.value)}
                  placeholder="e.g. Focus on practical terminal commands and deployment pipelines..."
                  className="w-full px-3 py-2 text-xs border border-border bg-background rounded-md outline-none focus:border-foreground resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-border">
                <BrutalButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAiModalOpen(false)}
                >
                  Cancel
                </BrutalButton>

                <BrutalButton
                  variant="success"
                  size="sm"
                  onClick={handleRunAiGeneration}
                  isLoading={isAiGenerating}
                >
                  <Sparkles size={14} className="mr-1.5" />
                  <span>Generate Syllabus Now</span>
                </BrutalButton>
              </div>
            </BrutalCard>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default CreateCoursePage;

/**
 * mockDatabase.js
 * In-memory and localStorage-backed database for Upskill Hub.
 * Preloaded with curriculum tracks and live workshops.
 */

const STORAGE_KEY_COURSES = "nacos_upskill_courses";
const STORAGE_KEY_TOPICS = "nacos_upskill_topics";
const STORAGE_KEY_ENROLLMENTS = "nacos_upskill_enrollments";
const STORAGE_KEY_WORKSHOPS = "nacos_upskill_workshop_regs";

const INITIAL_COURSES = [
  {
    id: "course-1",
    creator_id: null,
    title: "Modern JavaScript: Zero to Hero",
    level: "beginner",
    is_live_workshop: false,
    workshop_details: null,
    is_ai_generated: false,
    thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=600&auto=format&fit=crop",
    description: "Master the foundations of JavaScript from ES6+ syntax to functional programming, DOM manipulation, and asynchronous APIs.",
    tags: ["javascript", "frontend", "web-dev"],
    created_at: "2026-01-10T10:00:00Z"
  },
  {
    id: "course-2",
    creator_id: null,
    title: "Python for Data Science & AI",
    level: "intermediate",
    is_live_workshop: false,
    workshop_details: null,
    is_ai_generated: true,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop",
    description: "Hands-on data analysis, Pandas manipulation, NumPy vectorization, and data visualization pipelines in Python.",
    tags: ["python", "data-science", "ai"],
    created_at: "2026-01-15T12:00:00Z"
  },
  {
    id: "course-3",
    creator_id: "creator-1",
    title: "Fullstack React & Next.js Masterclass",
    level: "intermediate",
    is_live_workshop: true,
    workshop_details: {
      location: "FUTO ICT Innovation Center, Hall A",
      date: "2026-10-15",
      time: "14:00",
      duration: "3 hours",
    },
    is_ai_generated: false,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop",
    description: "Live workshop covering modern React 19 paradigms, server components, hooks architecture, and scalable state management.",
    tags: ["react", "frontend", "fullstack"],
    created_at: "2026-02-01T08:30:00Z"
  },
  {
    id: "course-4",
    creator_id: null,
    title: "Machine Learning & Deep Neural Nets",
    level: "beginner",
    is_live_workshop: false,
    workshop_details: null,
    is_ai_generated: true,
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&auto=format&fit=crop",
    description: "Foundations of machine learning, regression, classification models, neural network architectures, and PyTorch basics.",
    tags: ["machine-learning", "ai", "python"],
    created_at: "2026-02-10T14:00:00Z"
  },
  {
    id: "course-5",
    creator_id: "creator-1",
    title: "High-Performance Node.js & Microservices",
    level: "professional",
    is_live_workshop: true,
    workshop_details: {
      location: "Virtual Stage (Google Meet / Discord Live)",
      date: "2026-11-05",
      time: "16:00",
      duration: "4 hours",
    },
    is_ai_generated: false,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
    description: "Production-ready backend development, event loops, clustering, Redis caching, message queues, and API security.",
    tags: ["nodejs", "backend", "api"],
    created_at: "2026-02-20T10:00:00Z"
  },
];

const INITIAL_TOPICS = [
  {
    id: "topic-1",
    course_id: "course-1",
    title: "Modern JavaScript Variables & Primitive Types",
    video_url: "W6NZfCO5SIk",
    start_playing_at: 0,
    summary_text: "Deep dive into `const`, `let`, and lexical scoping. Understand the difference between primitive value copying and reference pointers in JavaScript memory management.",
    order_index: 1,
    duration: "14:20",
  },
  {
    id: "topic-2",
    course_id: "course-1",
    title: "Arrow Functions, Closures & Lexical Scope",
    video_url: "W6NZfCO5SIk",
    start_playing_at: 860,
    summary_text: "Master arrow function syntax, `this` context binding, and closure encapsulation for building clean modular libraries.",
    order_index: 2,
    duration: "18:45",
  },
  {
    id: "topic-3",
    course_id: "course-1",
    title: "Asynchronous JavaScript: Promises & Async/Await",
    video_url: "PoRJizFvM7s",
    start_playing_at: 0,
    summary_text: "Understand the JavaScript Event Loop, microtask queues, promise chaining, error handling with try/catch, and concurrent Promise.all execution.",
    order_index: 3,
    duration: "24:10",
  },
  {
    id: "topic-4",
    course_id: "course-2",
    title: "NumPy Vectorized Arrays & Numerical Computing",
    video_url: "QUT1VHiLmmI",
    start_playing_at: 0,
    summary_text: "Comprehensive introduction to NumPy ndarrays, multidimensional indexing, broadcasting rules, and high-speed mathematical operations.",
    order_index: 1,
    duration: "22:15",
  },
  {
    id: "topic-5",
    course_id: "course-2",
    title: "Pandas DataFrames & Statistical Aggregation",
    video_url: "vmEHCJofslg",
    start_playing_at: 0,
    summary_text: "Data cleaning, filtering, grouping, merging, and reshaping datasets with Pandas DataFrames for production analytics.",
    order_index: 2,
    duration: "28:30",
  },
  {
    id: "topic-6",
    course_id: "course-3",
    title: "React 19 Server Actions & Optimistic Updates",
    video_url: "SqcY0GlETPk",
    start_playing_at: 0,
    summary_text: "Building interactive, zero-latency UIs with React 19 form actions, useActionState, and optimistic UI transitions.",
    order_index: 1,
    duration: "32:00",
  },
];

// Helper functions for persistent local storage
function loadFromStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}
}

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = {
  // Courses
  async getCourses() {
    await delay(120);
    return loadFromStorage(STORAGE_KEY_COURSES, INITIAL_COURSES);
  },

  async getCourse(id) {
    await delay(100);
    const courses = loadFromStorage(STORAGE_KEY_COURSES, INITIAL_COURSES);
    return courses.find((c) => String(c.id) === String(id)) || null;
  },

  async getLiveWorkshops() {
    await delay(100);
    const courses = loadFromStorage(STORAGE_KEY_COURSES, INITIAL_COURSES);
    return courses.filter((c) => c.is_live_workshop);
  },

  async createCourse(courseData) {
    await delay(250);
    const courses = loadFromStorage(STORAGE_KEY_COURSES, INITIAL_COURSES);
    const newCourse = {
      ...courseData,
      id: courseData.id || `course-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    courses.unshift(newCourse);
    saveToStorage(STORAGE_KEY_COURSES, courses);
    return newCourse;
  },

  // Topics
  async getTopicsByCourse(courseId) {
    await delay(100);
    const topics = loadFromStorage(STORAGE_KEY_TOPICS, INITIAL_TOPICS);
    return topics
      .filter((t) => String(t.course_id) === String(courseId))
      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  },

  async createTopic(topicData) {
    await delay(150);
    const topics = loadFromStorage(STORAGE_KEY_TOPICS, INITIAL_TOPICS);
    const newTopic = {
      ...topicData,
      id: topicData.id || `topic-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    topics.push(newTopic);
    saveToStorage(STORAGE_KEY_TOPICS, topics);
    return newTopic;
  },

  async createBatchTopics(courseId, topicsArray) {
    await delay(200);
    const topics = loadFromStorage(STORAGE_KEY_TOPICS, INITIAL_TOPICS);
    const formatted = topicsArray.map((t, index) => ({
      ...t,
      id: t.id || `topic-${Date.now()}-${index}`,
      course_id: courseId,
      order_index: index + 1,
    }));
    const updated = [...topics, ...formatted];
    saveToStorage(STORAGE_KEY_TOPICS, updated);
    return formatted;
  },

  // Enrollments
  async getEnrollmentsByUser(userId) {
    await delay(100);
    const enrollments = loadFromStorage(STORAGE_KEY_ENROLLMENTS, []);
    return enrollments.filter((e) => String(e.user_id) === String(userId));
  },

  async getEnrollment(userId, courseId) {
    await delay(80);
    const enrollments = loadFromStorage(STORAGE_KEY_ENROLLMENTS, []);
    return (
      enrollments.find(
        (e) => String(e.user_id) === String(userId) && String(e.course_id) === String(courseId)
      ) || null
    );
  },

  async createEnrollment(userId, courseId) {
    await delay(200);
    const enrollments = loadFromStorage(STORAGE_KEY_ENROLLMENTS, []);
    const existing = enrollments.find(
      (e) => String(e.user_id) === String(userId) && String(e.course_id) === String(courseId)
    );
    if (existing) return existing;

    const newEnrollment = {
      id: `enroll-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      progress: 0,
      completed_topic_ids: [],
      enrolled_at: new Date().toISOString(),
    };
    enrollments.push(newEnrollment);
    saveToStorage(STORAGE_KEY_ENROLLMENTS, enrollments);
    return newEnrollment;
  },

  async markTopicComplete(enrollmentId, topicId, totalTopics = 1) {
    await delay(150);
    const enrollments = loadFromStorage(STORAGE_KEY_ENROLLMENTS, []);
    const enrollment = enrollments.find((e) => String(e.id) === String(enrollmentId));
    if (!enrollment) return null;

    if (!enrollment.completed_topic_ids) {
      enrollment.completed_topic_ids = [];
    }

    if (!enrollment.completed_topic_ids.includes(topicId)) {
      enrollment.completed_topic_ids.push(topicId);
      enrollment.progress = totalTopics > 0
        ? Math.min(100, Math.round((enrollment.completed_topic_ids.length / totalTopics) * 100))
        : 100;
      enrollment.updated_at = new Date().toISOString();
      saveToStorage(STORAGE_KEY_ENROLLMENTS, enrollments);
    }
    return enrollment;
  },

  // Live Workshop Registrations
  async registerForWorkshop(userId, courseId, creatorId = null) {
    await delay(150);
    const regs = loadFromStorage(STORAGE_KEY_WORKSHOPS, []);
    const existing = regs.find(
      (r) => String(r.user_id) === String(userId) && String(r.course_id) === String(courseId)
    );
    if (existing) return existing;

    const newReg = {
      id: `wreg-${Date.now()}`,
      user_id: userId,
      course_id: courseId,
      creator_id: creatorId,
      attended: false,
      student_note: "",
      remark: null,
      registered_at: new Date().toISOString(),
    };
    regs.push(newReg);
    saveToStorage(STORAGE_KEY_WORKSHOPS, regs);
    return newReg;
  },

  async getWorkshopRegistration(userId, courseId) {
    await delay(80);
    const regs = loadFromStorage(STORAGE_KEY_WORKSHOPS, []);
    return (
      regs.find(
        (r) => String(r.user_id) === String(userId) && String(r.course_id) === String(courseId)
      ) || null
    );
  },

  async updateStudentNote(regId, note) {
    await delay(100);
    const regs = loadFromStorage(STORAGE_KEY_WORKSHOPS, []);
    const reg = regs.find((r) => String(r.id) === String(regId));
    if (reg) {
      reg.student_note = note;
      reg.updated_at = new Date().toISOString();
      saveToStorage(STORAGE_KEY_WORKSHOPS, regs);
    }
    return reg;
  },

  async getWorkshopRoster(courseId) {
    await delay(120);
    const regs = loadFromStorage(STORAGE_KEY_WORKSHOPS, []);
    return regs.filter((r) => String(r.course_id) === String(courseId));
  },
};

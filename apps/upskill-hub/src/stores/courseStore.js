/**
 * courseStore.js
 * Central State Management for Courses, Topics, Enrollments, and Live Workshops in Upskill Hub.
 */
import { create } from "zustand";
import { db } from "../services/mockDatabase";

export const useCourseStore = create((set, get) => ({
  allCourses: [],
  currentCourse: null,
  currentTopics: [],
  userEnrollments: [],
  userWorkshopRegs: [],
  currentEnrollment: null,
  workshopRegistration: null,
  workshopRoster: [],

  status: "IDLE",
  enrollmentStatus: "IDLE",
  workshopStatus: "IDLE",
  errorMessage: null,

  // [1] Load all courses & workshops
  fetchAllCourses: async () => {
    set({ status: "PENDING" });
    try {
      const data = await db.getCourses();
      set({ allCourses: data, status: "SUCCESS" });
    } catch (err) {
      console.error("Fetch all courses failed:", err);
      set({ status: "ERROR", errorMessage: err.message });
    }
  },

  // [2] Load course by ID + its topics
  fetchCourseById: async (courseId) => {
    set({ status: "PENDING" });
    try {
      const course = await db.getCourse(courseId);
      if (!course) throw new Error("Course not found");

      const topics = await db.getTopicsByCourse(courseId);
      set({ currentCourse: course, currentTopics: topics, status: "SUCCESS" });
      return { course, topics };
    } catch (err) {
      console.error(`Fetch course ${courseId} failed:`, err);
      set({ status: "ERROR", errorMessage: err.message });
      return null;
    }
  },

  // [3] Fetch enrollments for a user
  fetchUserEnrollments: async (userId) => {
    try {
      const enrollments = await db.getEnrollmentsByUser(userId);
      set({ userEnrollments: enrollments });
    } catch (err) {
      console.error("Fetch enrollments failed:", err);
    }
  },

  // [3b] Fetch workshop registrations for a user
  fetchUserWorkshopRegistrations: async (userId) => {
    try {
      const regs = await db.getWorkshopRegistrationsByUser(userId);
      set({ userWorkshopRegs: regs });
    } catch (err) {
      console.error("Fetch workshop registrations failed:", err);
    }
  },

  // [4] Fetch current enrollment for single course
  fetchCurrentEnrollment: async (userId, courseId) => {
    set({ enrollmentStatus: "PENDING" });
    try {
      const enrollment = await db.getEnrollment(userId, courseId);
      set({ currentEnrollment: enrollment, enrollmentStatus: "SUCCESS" });
    } catch (err) {
      set({ enrollmentStatus: "ERROR" });
    }
  },

  // [5] Enroll in self-paced course
  enrollInCourse: async (userId, courseId) => {
    set({ enrollmentStatus: "PENDING" });
    try {
      const enrollment = await db.createEnrollment(userId, courseId);
      const userEnrollments = [...get().userEnrollments, enrollment];
      set({ currentEnrollment: enrollment, userEnrollments, enrollmentStatus: "SUCCESS" });
      return enrollment;
    } catch (err) {
      set({ enrollmentStatus: "ERROR" });
    }
  },

  // [6] Mark topic complete
  markTopicComplete: async (topicId) => {
    const { currentEnrollment, currentTopics } = get();
    if (!currentEnrollment) return;

    try {
      const updated = await db.markTopicComplete(
        currentEnrollment.id,
        topicId,
        currentTopics.length || 1
      );
      if (updated) {
        set({ currentEnrollment: updated });
      }
    } catch (err) {
      console.error("Mark topic complete failed:", err);
    }
  },

  // [7] Register for Live Workshop
  registerForWorkshop: async (userId, courseId, creatorId) => {
    set({ workshopStatus: "PENDING" });
    try {
      const reg = await db.registerForWorkshop(userId, courseId, creatorId);
      set({ workshopRegistration: reg, workshopStatus: "SUCCESS" });
      return reg;
    } catch (err) {
      set({ workshopStatus: "ERROR" });
    }
  },

  // [8] Fetch student's own registration for a workshop
  fetchMyWorkshopRegistration: async (userId, courseId) => {
    try {
      const reg = await db.getWorkshopRegistration(userId, courseId);
      set({ workshopRegistration: reg });
    } catch (err) {
      console.error("Fetch workshop reg failed:", err);
    }
  },

  // [9] Update student notes
  updateStudentNote: async (regId, note) => {
    try {
      const updated = await db.updateStudentNote(regId, note);
      if (updated) {
        set({ workshopRegistration: updated });
      }
    } catch (err) {
      console.error("Update note failed:", err);
    }
  },

  // [10] Fetch workshop roster for creator
  fetchWorkshopRoster: async (courseId) => {
    try {
      const roster = await db.getWorkshopRoster(courseId);
      set({ workshopRoster: roster });
    } catch (err) {
      console.error("Fetch roster failed:", err);
    }
  },

  // [11] Create course with topics
  createCourseWithCurriculum: async (courseData, topicsArray = []) => {
    set({ status: "PENDING" });
    try {
      const newCourse = await db.createCourse(courseData);
      let createdTopics = [];
      if (topicsArray && topicsArray.length > 0) {
        createdTopics = await db.createBatchTopics(newCourse.id, topicsArray);
      }
      const updatedCourses = [newCourse, ...get().allCourses];
      set({ allCourses: updatedCourses, status: "SUCCESS" });
      return { course: newCourse, topics: createdTopics };
    } catch (err) {
      console.error("Create course failed:", err);
      set({ status: "ERROR", errorMessage: err.message });
      throw err;
    }
  },
}));

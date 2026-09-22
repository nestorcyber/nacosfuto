/**
 * authStore.js
 * Authentication & Role State for Upskill Hub with NACOS Student integration.
 * Supports switching between Learner and Creator modes with Super Admin approval verification.
 */
import { create } from "zustand";
import { authService } from "../services/authService";
import { db } from "../services/mockDatabase";

export const useAuthStore = create((set, get) => ({
  user: authService.getCurrentUser(),
  status: "IDLE",
  isAuthenticated: Boolean(authService.getCurrentUser()),
  errorMessage: null,
  activeMode: (typeof window !== "undefined" && localStorage.getItem("nacos_upskill_active_mode")) || "learner",

  setUser: (userData) => {
    set({ user: userData, isAuthenticated: !!userData, status: "SUCCESS" });
  },

  switchMode: (mode) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("nacos_upskill_active_mode", mode);
    }
    set({ activeMode: mode });
  },

  isCreatorApproved: () => {
    const user = get().user;
    if (!user) return false;
    if (user.role === "creator" || user.user_metadata?.role === "creator" || user.isCreator || user.role === "super_admin" || user.role === "admin") {
      return true;
    }
    try {
      const raw = localStorage.getItem("nacos_approved_creators_db");
      if (raw) {
        const list = JSON.parse(raw);
        return list.some(
          (c) => (user.email && c.email?.toLowerCase() === user.email.toLowerCase()) || 
                 (user.id && String(c.user_id) === String(user.id))
        );
      }
    } catch (e) {}
    return false;
  },

  login: async (identifier, password) => {
    set({ status: "PENDING", errorMessage: null });
    try {
      const result = await authService.login(identifier, password);
      if (result.success) {
        set({ user: result.user, isAuthenticated: true, status: "SUCCESS", errorMessage: null });
        return { success: true };
      } else {
        set({ status: "ERROR", errorMessage: result.error });
        return result;
      }
    } catch (err) {
      set({ status: "ERROR", errorMessage: err.message });
      return { success: false, error: err.message };
    }
  },

  register: async (formData) => {
    set({ status: "PENDING", errorMessage: null });
    try {
      const result = await authService.register(formData);
      if (result.success) {
        set({ user: result.user, isAuthenticated: true, status: "SUCCESS", errorMessage: null });
        return { success: true };
      } else {
        set({ status: "ERROR", errorMessage: result.error });
        return result;
      }
    } catch (err) {
      set({ status: "ERROR", errorMessage: err.message });
      return { success: false, error: err.message };
    }
  },

  toggleRole: () => {
    const current = get().user;
    if (!current) return;
    const currentRole = current.user_metadata?.role || "learner";
    const nextRole = currentRole === "creator" ? "learner" : "creator";
    const updated = {
      ...current,
      user_metadata: {
        ...current.user_metadata,
        role: nextRole,
      },
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("nacos_upskill_user", JSON.stringify(updated));
    }
    set({ user: updated, activeMode: nextRole });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, activeMode: "learner", status: "IDLE", errorMessage: null });
  },
}));

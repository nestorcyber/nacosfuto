/**
 * authStore.js
 * Authentication & Role State for Upskill Hub with NACOS Student integration.
 */
import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set, get) => ({
  user: authService.getCurrentUser(),
  status: "IDLE",
  isAuthenticated: Boolean(authService.getCurrentUser()),
  errorMessage: null,

  setUser: (userData) => {
    set({ user: userData, isAuthenticated: !!userData, status: "SUCCESS" });
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
    set({ user: updated });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, status: "IDLE", errorMessage: null });
  },
}));

/**
 * authStore.js
 * Authentication & Creator Role State for Upskill Hub.
 */
import { create } from "zustand";

const STORAGE_KEY_AUTH = "nacos_upskill_user";

function getInitialUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (raw) return JSON.parse(raw);

    // If student is already logged into NACOS Portal, auto-derive user
    const portalUserRaw = localStorage.getItem("nacos_user");
    if (portalUserRaw) {
      const p = JSON.parse(portalUserRaw);
      return {
        id: p.id || "student-user",
        email: p.email || "student@nacos.org.ng",
        user_metadata: {
          full_name: p.full_name || p.name || "NACOS Scholar",
          role: "creator", // Allow exploration of creator features by default
          matric_number: p.matric_number || "",
        },
      };
    }
  } catch (e) {}

  // Default guest scholar
  return {
    id: "guest-scholar-1",
    email: "scholar@nacosfuto.org",
    user_metadata: {
      full_name: "NACOS Scholar",
      role: "creator",
    },
  };
}

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  status: "SUCCESS",
  isAuthenticated: true,

  setUser: (userData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userData));
    }
    set({ user: userData, isAuthenticated: !!userData, status: "SUCCESS" });
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
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));
    }
    set({ user: updated });
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
    set({ user: null, isAuthenticated: false, status: "NO_USER" });
  },
}));

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { useAuthStore } from "../stores/authStore";

export function SignUpPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("creator");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim()) {
      setError("Please fill out your name and email.");
      return;
    }

    const scholarUser = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      user_metadata: {
        full_name: fullName.trim(),
        role: role || "creator",
      },
    };

    setUser(scholarUser);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-sans">
      <BrutalCard className="max-w-md w-full p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#138601] text-white flex items-center justify-center font-bold text-base mx-auto">
            UH
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Join Upskill Hub</h1>
          <p className="text-xs text-muted-foreground">
            Start learning or authoring tracks on the NACOS FUTO platform
          </p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Daniel Chukwuka"
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@nacosfuto.org"
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1">
              Initial Mode / Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground cursor-pointer"
            >
              <option value="creator">Creator (Design courses & host live workshops)</option>
              <option value="learner">Learner (Explore and complete tracks)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-border bg-background rounded-md outline-none focus:border-foreground"
            />
          </div>

          <BrutalButton type="submit" variant="primary" size="lg" className="w-full">
            <span>Create Account</span>
            <ArrowRight size={16} className="ml-1.5" />
          </BrutalButton>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-foreground underline">
            Sign in
          </Link>
        </div>
      </BrutalCard>
    </div>
  );
}

export default SignUpPage;

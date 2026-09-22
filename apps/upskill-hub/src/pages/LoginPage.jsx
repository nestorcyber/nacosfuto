import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { BrutalCard } from "../components/ui/BrutalCard";
import { BrutalButton } from "../components/ui/BrutalButton";
import { useAuthStore } from "../stores/authStore";

export function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your student email.");
      return;
    }

    const scholarUser = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      user_metadata: {
        full_name: email.split("@")[0].replace(".", " "),
        role: "creator",
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
          <h1 className="text-2xl font-bold tracking-tight">Upskill Hub</h1>
          <p className="text-xs text-muted-foreground">Sign in to your learning dashboard</p>
        </div>

        {error && (
          <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            <span>Sign In</span>
            <ArrowRight size={16} className="ml-1.5" />
          </BrutalButton>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/sign-up" className="font-semibold text-foreground underline">
            Sign up
          </Link>
        </div>
      </BrutalCard>
    </div>
  );
}

export default LoginPage;

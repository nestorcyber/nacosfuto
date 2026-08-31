import { useEffect } from "react";
import SignupForm from "../components/auth/SignupForm";
import Navbar from "../components/Nav/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "auto"; // force-enable scroll
  }, []);

  useEffect(() => {
    if (isLoggedIn && user) {
      navigate(user.isStaff ? "/staff-dashboard" : "/dashboard", {
        replace: true,
      });
    }
  }, [isLoggedIn, user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <SignupForm />
      </main>
    </div>
  );
}

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ResourcesPage from "./pages/ResourcesPage";
import MyLearningPage from "./pages/MyLearningPage";
import CreateCoursePage from "./pages/CreateCoursePage";
import WorkshopsPage from "./pages/WorkshopsPage";
import MyWorkshopsPage from "./pages/MyWorkshopsPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Upskill Hub ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#07101e] border border-[#0056D2]/40 rounded-xl p-6 text-center space-y-4 shadow-lg">
            <h2 className="text-lg font-bold text-white">Something went wrong</h2>
            <p className="text-xs text-gray-300">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 rounded-md bg-[#0056D2] text-white text-xs font-semibold cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const isNestedUnderUpskill =
    typeof window !== "undefined" &&
    window.location.pathname.startsWith("/upskill-hub");

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter basename={isNestedUnderUpskill ? "/upskill-hub" : "/"}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/my-learning" element={<MyLearningPage />} />
              <Route path="/my-courses" element={<Navigate to="/my-learning" replace />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/create-course" element={<CreateCoursePage />} />
              <Route path="/my-workshops" element={<MyWorkshopsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

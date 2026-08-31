import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GSAPWrapper from "./utils/GSAPWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Page imports
import Home from "./pages/Home";
import About from "./pages/About";
import Administration from "./pages/Administration";
import Anthems from "./pages/Anthems";
import AcademicCalendar from "./pages/AcademicCalendar";
import Gallery from "./pages/Gallery";
import NacosExecutives from "./pages/NacosExecutives";
import Research from "./pages/Research";
import Alumni from "./pages/Alumni";
import StudentLife from "./pages/StudentLife";
import Academics from "./pages/Academics";
import Clubs from "./pages/Clubs";
import Contact from "./pages/Contact";
import Admissions from "./pages/Admissions";
import AcademicPrograms from "./pages/AcademicPrograms";
import HowToApply from "./pages/HowToApply";
import AdmissionRequirements from "./pages/AdmissionRequirements";
import TuitionFees from "./pages/TuitionFees";
import CampusTour from "./pages/CampusTour";
import CampusClubs from "./pages/CampusClubs";
import FAQsPage from "./pages/FAQsPage";
import ReportIssue from "./pages/ReportIssue";
import Faculty from "./pages/Faculty";
import Resources from "./pages/Resources";
import Announcements from "./pages/Announcements";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import UnreadAnnouncementBanner from "./components/UnreadAnnouncementBanner";

// Lazy-loaded pages
const Events = lazy(() => import("./pages/Events"));
const YellowPages = lazy(() => import("./pages/YellowPages"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <GSAPWrapper>
        <UnreadAnnouncementBanner />
        <BrowserRouter>
          <Routes>
            {/* Core Website Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/nacos-executives" element={<NacosExecutives />} />
            <Route path="/about/administration" element={<Administration />} />
            <Route path="/about/anthems" element={<Anthems />} />
            <Route path="/about/calendar" element={<AcademicCalendar />} />
            <Route path="/about/gallery" element={<Gallery />} />
            <Route path="/about/alumni" element={<Alumni />} />

            {/* Academics & Programs */}
            <Route path="/academics" element={<Academics />} />
            <Route path="/programs" element={<AcademicPrograms />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/resources" element={<Resources />} />

            {/* Admissions */}
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/how-to-apply" element={<HowToApply />} />
            <Route path="/admission-requirements" element={<AdmissionRequirements />} />
            <Route path="/tuition-fees" element={<TuitionFees />} />
            <Route path="/admission-portal" element={<PlaceholderPage title="Admission Portal" />} />

            {/* Campus Life */}
            <Route path="/students" element={<StudentLife />} />
            <Route path="/campus-tour" element={<CampusTour />} />
            <Route path="/campus-clubs" element={<CampusClubs />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/events" element={<Suspense fallback={<PageLoader />}><Events /></Suspense>} />
            <Route path="/yellow-pages" element={<Suspense fallback={<PageLoader />}><YellowPages /></Suspense>} />
            <Route path="/spiritual-life" element={<PlaceholderPage title="Spiritual Life" />} />

            {/* Research */}
            <Route path="/research" element={<Research />} />
            <Route path="/student-research" element={<PlaceholderPage title="Student Research" />} />
            <Route path="/collaboration" element={<PlaceholderPage title="Research Collaboration" />} />
            <Route path="/research-facilities" element={<PlaceholderPage title="Research Facilities" />} />
            <Route path="/research-grants" element={<PlaceholderPage title="Research Grants" />} />

            {/* Announcements & Resources */}
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/student-handbook" element={<PlaceholderPage title="Student Handbook" />} />
            <Route path="/faqs" element={<FAQsPage />} />

            {/* Support & Health */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/guidance-counselling" element={<PlaceholderPage title="Guidance & Counselling" />} />
            <Route path="/safety-alerts" element={<PlaceholderPage title="Safety Alerts" />} />
            <Route path="/report-emergency" element={<ReportIssue />} />
            <Route path="/health-services" element={<PlaceholderPage title="Health Services" />} />
            <Route path="/careers-recruitment" element={<PlaceholderPage title="Careers & Recruitment" />} />

            {/* Upskill Courses */}
            <Route path="/upskill/web-development" element={<PlaceholderPage title="Web Development" message="Explore our upcoming Web Development masterclasses and bootcamps." />} />
            <Route path="/upskill/ai-automation" element={<PlaceholderPage title="AI & Automation" message="Master AI engineering tools and workflow automations." />} />
            <Route path="/upskill/vibe-coding" element={<PlaceholderPage title="Vibe Coding" message="Learn modern AI-assisted prompt engineering and full-stack software prototyping." />} />
            <Route path="/upskill/social-media" element={<PlaceholderPage title="Social Media" message="Grow tech brands and personal influence across social platforms." />} />
            <Route path="/upskill/all" element={<PlaceholderPage title="All Courses" message="Browse the complete catalog of skill tracks." />} />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GSAPWrapper>
    </>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Dues from './pages/Dues';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import IdCard from './pages/IdCard';
import AdminStudents from './pages/AdminStudents';
import HackathonDetail from './pages/HackathonDetail';
import HackathonApply from './pages/HackathonApply';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Authentication & Student Entry */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Core Student Academic Portal */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dues" element={<Dues />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/id-card" element={<IdCard />} />

          {/* Admin Student Registry & Academic Management */}
          <Route path="/admin/students" element={<AdminStudents />} />

          {/* Dedicated National Hackathon Module (Accessible via button/link without cluttering student portal) */}
          <Route path="/hackathons" element={<Navigate to="/hackathons/BuildXNACOS" replace />} />
          <Route path="/hackathons/BuildXNACOS" element={<HackathonDetail />} />
          <Route path="/hackathons/BuildXNACOS/apply" element={<HackathonApply />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

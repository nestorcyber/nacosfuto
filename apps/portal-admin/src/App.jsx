import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';

import PortalAdminLogin from './pages/PortalAdminLogin';
import PortalAdminDashboard from './pages/PortalAdminDashboard';
import PortalAdminStudents from './pages/PortalAdminStudents';
import PortalAdminIdCards from './pages/PortalAdminIdCards';
import PortalAdminResources from './pages/PortalAdminResources';
import PortalAdminMedia from './pages/PortalAdminMedia';
import PortalAdminSettings from './pages/PortalAdminSettings';
import PortalAdminProtectedRoute from './components/PortalAdminProtectedRoute';

function App() {
  const isNestedUnderPortalAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/portal-admin');

  return (
    <ThemeProvider>
      <BrowserRouter basename={isNestedUnderPortalAdmin ? '/portal-admin' : '/'}>
        <Routes>
          {/* Public Administrative Authentication */}
          <Route path="/login" element={<PortalAdminLogin />} />

          {/* Protected Portal Admin Operations */}
          <Route 
            path="/" 
            element={
              <PortalAdminProtectedRoute>
                <PortalAdminDashboard />
              </PortalAdminProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <PortalAdminProtectedRoute>
                <PortalAdminDashboard />
              </PortalAdminProtectedRoute>
            } 
          />
          <Route 
            path="/students" 
            element={
              <PortalAdminProtectedRoute requiredPermission="student_portal.students">
                <PortalAdminStudents />
              </PortalAdminProtectedRoute>
            } 
          />
          <Route 
            path="/id-cards" 
            element={
              <PortalAdminProtectedRoute requiredPermission="student_portal.id_cards">
                <PortalAdminIdCards />
              </PortalAdminProtectedRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <PortalAdminProtectedRoute requiredPermission="student_portal.view">
                <PortalAdminResources />
              </PortalAdminProtectedRoute>
            } 
          />
          <Route 
            path="/media" 
            element={
              <PortalAdminProtectedRoute requiredPermission="student_portal.view">
                <PortalAdminMedia />
              </PortalAdminProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <PortalAdminProtectedRoute requiredPermission="student_portal.settings">
                <PortalAdminSettings />
              </PortalAdminProtectedRoute>
            } 
          />

          {/* Legacy Aliases */}
          <Route path="/admin/students" element={<Navigate to="/students" replace />} />
          <Route path="/admin/id-cards" element={<Navigate to="/id-cards" replace />} />
          <Route path="/admin/media" element={<Navigate to="/media" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading && !authChecked) {
      // Immediate redirect if not logged in
      if (!isLoggedIn) {
        navigate('/login', { 
          state: { from: location },
          replace: true
        });
        return;
      }

      // Check role only after confirming we have user data
      if (user) {
        const hasRequiredRole = !requiredRole || user.userType === requiredRole;
        if (!hasRequiredRole) {
          navigate(user.isStaff ? '/staff-dashboard' : '/dashboard', {
            replace: true
          });
          return;
        }
        setAuthChecked(true);
      }
    }
  }, [loading, isLoggedIn, user, requiredRole, authChecked, navigate, location]);

  if (loading || !authChecked) {
    return <LoadingSpinner />;
  }

  return children;
}
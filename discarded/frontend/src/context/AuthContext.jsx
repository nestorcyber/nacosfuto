import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'https://futocsc-backend.onrender.com/api';
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      // First check if we have a token
      const { data: tokenInfo } = await axios.get('/auth/token-info');
      
      if (!tokenInfo?.userType) {
        throw new Error('Invalid token info');
      }

      // Then fetch user data based on type
      const endpoint = tokenInfo.userType === 'student' 
        ? '/auth/me/student' 
        : '/auth/me/staff';

      const { data: userData } = await axios.get(endpoint);

      const updatedUser = {
        ...userData,
        userType: tokenInfo.userType,
        isStaff: tokenInfo.userType === 'staff',
        isStudent: tokenInfo.userType === 'student',
      };

      setUser(updatedUser);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Auth error:", error);
      // Only clear if we receive an explicit auth error (401/403)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
         await logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const endpoint = credentials.userType === 'student' 
        ? '/auth/student-login' 
        : '/auth/staff-login';
  
      const { data } = await axios.post(endpoint, {
        identifier: credentials.identifier,
        password: credentials.password,
        ...(credentials.userType === 'staff' && { is_course_rep: credentials.isCourseRep })
      }, {
        withCredentials: true,
      });
  
      if (data.success) {
        // Normalize user data before setting state
        const normalizedUser = {
          ...data.user,
          isStaff: data.user.userType === 'staff',  // Set here
          isStudent: data.user.userType === 'student'  // Set here
        };
        
        setUser(normalizedUser);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
       console.error('Error logging out:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
      localStorage.removeItem('gpa_calculator_courses');
      localStorage.removeItem('gpa_calculator_gpa');
      localStorage.removeItem('gpa_calculator_cgpa');
      // Clear token cookie
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    return true;
  };

  // Dummy login for staff (testing only)
  const dummyLoginAsStaff = () => {
    const dummyStaff = {
      id: 999,
      first_name: 'Dummy',
      last_name: 'Staff',
      email: 'dummy.staff@futo.edu',
      userType: 'staff',
      isStaff: true,
      isStudent: false,
    };
    setUser(dummyStaff);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(dummyStaff));
  };

  // Dummy logout for staff (testing only)
  const dummyLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      if (!user) { // Only fetch if not already loaded from localStorage
          await fetchUserData();
      } else {
        setLoading(false); // If we have user from localStorage, stop loading immediately
        // Optionally valid in background: fetchUserData(); 
      }
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      loading,
      fetchUserData,
      dummyLoginAsStaff,
      dummyLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
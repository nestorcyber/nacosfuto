import { useEffect, useState } from 'react';

export default function useTheme() {
  const [theme, setTheme] = useState('system'); // Start with system to prevent flash

  useEffect(() => {
    // This code runs only on client-side after hydration
    const storedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize theme
    const initialTheme = storedTheme === 'dark' || storedTheme === 'light' 
      ? storedTheme 
      : systemDark ? 'dark' : 'light';
    
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'system';
      return 'dark'; // system -> dark
    });
  };

  return [theme, toggleTheme];
}
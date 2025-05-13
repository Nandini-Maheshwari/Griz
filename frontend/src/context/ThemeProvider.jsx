import React, { useState, useEffect } from 'react';
import { ThemeContext } from './themeContext';

const ThemeProvider = ({ children }) => {
  // Check for user preference in local storage or use system preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedPrefs = window.localStorage.getItem('theme');
      if (typeof storedPrefs === 'string') {
        return storedPrefs;
      }

      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return 'dark';
      }
    }

    return 'light'; // Default theme
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    // Apply theme immediately when component mounts
    const root = window.document.documentElement;
    
    // First remove both classes to ensure clean state
    root.classList.remove('light', 'dark');
    
    // Then add the current theme
    root.classList.add(theme);
    
    // To debug
    console.log('Current theme:', theme);
    console.log('Document classes:', root.classList);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
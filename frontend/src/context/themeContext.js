import { createContext, useContext } from 'react';

// Create the context
export const ThemeContext = createContext();

// Create the hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
// This function runs before app render to prevent theme flash
export const initializeTheme = () => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    // If no saved preference, check system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
      return;
    }
    
    // Apply saved theme
    document.documentElement.classList.add(savedTheme);
  };
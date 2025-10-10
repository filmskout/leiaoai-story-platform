import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// Get system preference
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Get time-based theme (smart mode)
function getTimeBasedTheme(): 'light' | 'dark' {
  const now = new Date();
  const hour = now.getHours();
  // Dark mode: 19:00 - 06:59, Light mode: 07:00 - 18:59
  return (hour >= 19 || hour < 7) ? 'dark' : 'light';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'auto';
    const saved = localStorage.getItem('leoai-theme');
    return (saved as Theme) || 'auto';
  });
  
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    // Initialize with system preference
    return getSystemTheme();
  });

  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === 'auto') {
        // Smart mode: use system preference with time-based fallback
        const systemTheme = getSystemTheme();
        const timeTheme = getTimeBasedTheme();
        
        // Prefer system theme, fall back to time-based if system doesn't specify
        setActualTheme(systemTheme || timeTheme);
      } else {
        setActualTheme(theme);
      }
    };

    // Initial update
    updateActualTheme();

    // Listen for system theme changes in auto mode
    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateActualTheme();
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Check for time changes every minute (for time-based switching)
      const timeCheckInterval = setInterval(() => {
        updateActualTheme();
      }, 60000); // Check every 60 seconds
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
        clearInterval(timeCheckInterval);
      };
    }
  }, [theme]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(actualTheme);
    
    // Set CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition', 'background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease');
    
    // Update meta theme-color for browser UI
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', actualTheme === 'dark' ? '#0f0f0f' : '#ffffff');
    }
    
    // Update body background for seamless theming
    document.body.style.backgroundColor = actualTheme === 'dark' ? '#0f0f0f' : '#ffffff';
    document.body.style.color = actualTheme === 'dark' ? '#f5f5f5' : '#0f0f0f';
    
    // Persist theme preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('leoai-theme', theme);
    }
  }, [actualTheme, theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leoai-theme', newTheme);
    }
  };

  const toggleTheme = () => {
    // Cycle through: light -> dark -> auto -> light
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const value = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
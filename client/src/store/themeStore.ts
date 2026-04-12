import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const resolved = theme === 'system' ? getSystemTheme() : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

export const useThemeStore = create<ThemeStore>((set) => {
  // Read from localStorage on initial load
  const stored = (localStorage.getItem('mediakajo-theme') as Theme) || 'light';
  
  // Apply immediately
  applyTheme(stored);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const current = localStorage.getItem('mediakajo-theme') as Theme;
    if (current === 'system') {
      applyTheme('system');
    }
  });

  return {
    theme: stored,
    setTheme: (theme: Theme) => {
      localStorage.setItem('mediakajo-theme', theme);
      applyTheme(theme);
      set({ theme });
    },
  };
});

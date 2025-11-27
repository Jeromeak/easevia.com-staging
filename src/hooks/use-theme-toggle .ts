'use client';
import { useEffect, useState } from 'react';

export const useThemeToggle = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    const stored = localStorage.getItem('theme');

    if (stored === 'dark') {
      root.classList.add('dark');
      setIsDark(true);
    } else if (stored === 'light') {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      const isDarkMode = root.classList.contains('dark');
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;

    if (isDark) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return { isDark, toggleTheme };
};

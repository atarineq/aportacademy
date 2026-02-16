
import React, { useEffect } from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, isDarkMode, user }) => {
  useEffect(() => {
    if (isDarkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [isDarkMode]);

  return <div className="min-h-screen">{children}</div>;
};

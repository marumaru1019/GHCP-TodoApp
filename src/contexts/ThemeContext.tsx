'use client';

// 📝 テーマプロバイダーコンポーネント
import { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { Theme, ThemeSettings } from '@/types/theme';

interface ThemeContextType {
  currentTheme: Theme;
  settings: ThemeSettings;
  availableThemes: Theme[];
  isLoaded: boolean;
  setTheme: (themeId: string) => void;
  createCustomTheme: (theme: Omit<Theme, 'id'>) => Theme;
  deleteCustomTheme: (themeId: string) => void;
  updateSettings: (settings: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}
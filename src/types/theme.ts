// 📝 テーマシステムの型定義
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  accent: string;
  success: string;
  warning: string;
  error: string;
  border: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  isDark: boolean;
  fontFamily?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

export type ThemePreset = 'light' | 'dark' | 'high-contrast' | 'blue' | 'green' | 'pink';

export interface ThemeSettings {
  currentTheme: string;
  customThemes: Theme[];
  fontSize: 'small' | 'medium' | 'large';
  reduceMotion: boolean;
  highContrast: boolean;
}
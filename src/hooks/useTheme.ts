'use client';

// 📝 テーマ管理のカスタムフック
import { useState, useEffect, useCallback } from 'react';
import { Theme, ThemeSettings } from '@/types/theme';
import { presetThemes } from '@/lib/themes';

const THEME_STORAGE_KEY = 'theme-settings';
const DEFAULT_SETTINGS: ThemeSettings = {
  currentTheme: 'light',
  customThemes: [],
  fontSize: 'medium',
  reduceMotion: false,
  highContrast: false,
};

export const useTheme = () => {
  const [settings, setSettings] = useState<ThemeSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // 📝 ローカルストレージから設定を読み込み
  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (error) {
        console.warn('Failed to parse theme settings:', error);
      }
    }
    
    // 📝 システムの設定を検出
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!stored) {
      setSettings(prev => ({
        ...prev,
        currentTheme: prefersDark ? 'dark' : 'light',
        reduceMotion: prefersReducedMotion,
      }));
    }
    
    setIsLoaded(true);
  }, []);

  // 📝 設定変更時にローカルストレージに保存
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // 📝 現在のテーマを取得
  const getCurrentTheme = useCallback((): Theme => {
    return presetThemes[settings.currentTheme] || 
           settings.customThemes.find(t => t.id === settings.currentTheme) || 
           presetThemes.light;
  }, [settings.currentTheme, settings.customThemes]);

  // 📝 CSS変数を適用
  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    const colors = theme.colors;
    
    // 📝 カラー変数を設定
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-background', colors.background);
    root.style.setProperty('--theme-surface', colors.surface);
    root.style.setProperty('--theme-text-primary', colors.text.primary);
    root.style.setProperty('--theme-text-secondary', colors.text.secondary);
    root.style.setProperty('--theme-text-disabled', colors.text.disabled);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-success', colors.success);
    root.style.setProperty('--theme-warning', colors.warning);
    root.style.setProperty('--theme-error', colors.error);
    root.style.setProperty('--theme-border', colors.border);
    
    // 📝 既存の変数も更新（後方互換性）
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.text.primary);
    root.style.setProperty('--primary', colors.primary);
    
    // 📝 ダークモードクラスを設定
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // 📝 フォントサイズを設定
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize]);
    
    // 📝 アクセシビリティ設定
    if (settings.reduceMotion) {
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.setProperty('--transition-duration', '0.2s');
    }
  }, [settings.fontSize, settings.reduceMotion]);

  // 📝 テーマ適用（設定変更時）
  useEffect(() => {
    if (isLoaded) {
      const currentTheme = getCurrentTheme();
      applyTheme(currentTheme);
    }
  }, [getCurrentTheme, applyTheme, isLoaded]);

  // 📝 テーマ変更
  const setTheme = useCallback((themeId: string) => {
    setSettings(prev => ({ ...prev, currentTheme: themeId }));
  }, []);

  // 📝 カスタムテーマ作成
  const createCustomTheme = useCallback((theme: Omit<Theme, 'id'>) => {
    const id = `custom-${Date.now()}`;
    const newTheme: Theme = { ...theme, id };
    
    setSettings(prev => ({
      ...prev,
      customThemes: [...prev.customThemes, newTheme],
      currentTheme: id,
    }));
    
    return newTheme;
  }, []);

  // 📝 カスタムテーマ削除
  const deleteCustomTheme = useCallback((themeId: string) => {
    setSettings(prev => ({
      ...prev,
      customThemes: prev.customThemes.filter(t => t.id !== themeId),
      currentTheme: prev.currentTheme === themeId ? 'light' : prev.currentTheme,
    }));
  }, []);

  // 📝 設定更新
  const updateSettings = useCallback((newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // 📝 利用可能なテーマ一覧
  const availableThemes = Object.values(presetThemes).concat(settings.customThemes);

  return {
    settings,
    currentTheme: getCurrentTheme(),
    availableThemes,
    isLoaded,
    setTheme,
    createCustomTheme,
    deleteCustomTheme,
    updateSettings,
    applyTheme,
  };
};
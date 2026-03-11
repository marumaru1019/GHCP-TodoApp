// 📝 テーマシステムのテスト
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// 📝 LocalStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

// 📝 window.matchMediaのモック
const matchMediaMock = (query: string) => ({
  matches: false, // 📝 常にfalseを返すように修正
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
});

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'matchMedia', { value: matchMediaMock });

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // 📝 DOMのモック
    Object.defineProperty(document, 'documentElement', {
      value: {
        style: {
          setProperty: jest.fn(),
        },
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      },
      configurable: true,
    });
  });

  it('初期設定でライトテーマが選択される', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.currentTheme.id).toBe('light');
    expect(result.current.currentTheme.name).toBe('ライト');
    expect(result.current.currentTheme.isDark).toBe(false);
  });

  it('テーマを変更できる', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.currentTheme.id).toBe('dark');
    expect(result.current.currentTheme.name).toBe('ダーク');
    expect(result.current.currentTheme.isDark).toBe(true);
  });

  it('設定をローカルストレージに保存する', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('blue');
    });
    
    const saved = localStorage.getItem('theme-settings');
    expect(saved).toBeTruthy();
    
    if (saved) {
      const settings = JSON.parse(saved);
      expect(settings.currentTheme).toBe('blue');
    }
  });

  it('フォントサイズを変更できる', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.updateSettings({ fontSize: 'large' });
    });
    
    expect(result.current.settings.fontSize).toBe('large');
  });

  it('カスタムテーマを作成できる', () => {
    const { result } = renderHook(() => useTheme());
    
    const customTheme = {
      name: 'カスタムテーマ',
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#0000ff',
        surface: '#ffffff',
        text: {
          primary: '#000000',
          secondary: '#333333',
          disabled: '#999999',
        },
        accent: '#ffff00',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        border: '#cccccc',
      },
      isDark: false,
    };
    
    let createdTheme;
    act(() => {
      createdTheme = result.current.createCustomTheme(customTheme);
    });
    
    expect(createdTheme).toBeDefined();
    expect(createdTheme!.name).toBe('カスタムテーマ');
    expect(createdTheme!.id).toMatch(/^custom-/);
    expect(result.current.currentTheme.id).toBe(createdTheme!.id);
  });

  it('カスタムテーマを削除できる', () => {
    const { result } = renderHook(() => useTheme());
    
    const customTheme = {
      name: 'テスト削除',
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
        background: '#0000ff',
        surface: '#ffffff',
        text: {
          primary: '#000000',
          secondary: '#333333',
          disabled: '#999999',
        },
        accent: '#ffff00',
        success: '#00ff00',
        warning: '#ffaa00',
        error: '#ff0000',
        border: '#cccccc',
      },
      isDark: false,
    };
    
    let createdTheme;
    act(() => {
      createdTheme = result.current.createCustomTheme(customTheme);
    });
    
    const initialCount = result.current.availableThemes.length;
    
    act(() => {
      result.current.deleteCustomTheme(createdTheme!.id);
    });
    
    expect(result.current.availableThemes.length).toBe(initialCount - 1);
    expect(result.current.currentTheme.id).toBe('light'); // 📝 削除後はライトテーマに戻る
  });

  it('存在しないテーマIDでもエラーにならない', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('non-existent-theme');
    });
    
    // 📝 存在しないテーマの場合はライトテーマにフォールバック
    expect(result.current.currentTheme.id).toBe('light');
  });

  it('利用可能なテーマ一覧にプリセットが含まれる', () => {
    const { result } = renderHook(() => useTheme());
    
    const themeIds = result.current.availableThemes.map(t => t.id);
    expect(themeIds).toContain('light');
    expect(themeIds).toContain('dark');
    expect(themeIds).toContain('high-contrast');
    expect(themeIds).toContain('blue');
    expect(themeIds).toContain('green');
    expect(themeIds).toContain('pink');
  });
});
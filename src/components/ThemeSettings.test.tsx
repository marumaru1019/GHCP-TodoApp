// 📝 ThemeSettingsコンポーネントのテスト
import { render, screen } from '@testing-library/react';
import { ThemeSettings } from './ThemeSettings';
import { ThemeProvider } from '@/contexts/ThemeContext';

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
  matches: false,
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

// 📝 テストヘルパー関数
const renderWithThemeProvider = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('ThemeSettings', () => {
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

  it('テーマ設定ボタンが表示される', () => {
    renderWithThemeProvider(<ThemeSettings />);
    const button = screen.getByLabelText('テーマ設定を開く');
    expect(button).toBeInTheDocument();
  });

  it('基本的なレンダリングができる', () => {
    const { container } = renderWithThemeProvider(<ThemeSettings />);
    expect(container).toBeInTheDocument();
  });
});
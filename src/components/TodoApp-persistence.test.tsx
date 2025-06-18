import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoApp } from './TodoApp';

// 📝 crypto.randomUUID のモック
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-123'),
  },
});

// 📝 localStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 📝 URL API のモック（エクスポート機能用）
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
});
Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
});

describe('TodoApp with localStorage persistence', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('タスクを追加すると localStorage に保存される', async () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const addButton = screen.getByText('追加');
    
    // タスクを追加
    fireEvent.change(input, { target: { value: 'テスト永続化タスク' } });
    fireEvent.click(addButton);
    
    // localStorage に保存されたことを確認
    await waitFor(() => {
      const stored = localStorageMock.getItem('todoApp_tasks');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const todos = JSON.parse(stored);
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe('テスト永続化タスク');
      }
    });
  });

  it('localStorage からタスクを復元する', () => {
    // 事前に localStorage にデータを保存
    const testTodos = [
      {
        id: 'test-1',
        text: '復元テストタスク',
        completed: false,
        createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      },
    ];
    localStorageMock.setItem('todoApp_tasks', JSON.stringify(testTodos));
    
    // TodoApp をレンダリング
    render(<TodoApp />);
    
    // 復元されたタスクが表示されることを確認
    expect(screen.getByText('復元テストタスク')).toBeInTheDocument();
  });

  it('タスクの完了状態変更が localStorage に保存される', async () => {
    // 事前にタスクを追加
    const testTodos = [
      {
        id: 'test-1',
        text: '完了テストタスク',
        completed: false,
        createdAt: new Date('2024-01-01T10:00:00Z').toISOString(),
      },
    ];
    localStorageMock.setItem('todoApp_tasks', JSON.stringify(testTodos));
    
    render(<TodoApp />);
    
    // タスクの完了状態を変更
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // localStorage の状態が更新されたことを確認
    await waitFor(() => {
      const stored = localStorageMock.getItem('todoApp_tasks');
      expect(stored).toBeTruthy();
      
      if (stored) {
        const todos = JSON.parse(stored);
        expect(todos[0].completed).toBe(true);
      }
    });
  });

  it('データ管理メニューが表示される', () => {
    render(<TodoApp />);
    expect(screen.getByLabelText('データ管理メニュー')).toBeInTheDocument();
  });
});
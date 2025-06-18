import { render, screen, fireEvent } from '@testing-library/react';
import { DataManagement } from './DataManagement';
import { Todo } from '@/types/todo';

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

// 📝 window.confirm のモック
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', { value: mockConfirm });

// 📝 URL.createObjectURL のモック
Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
});
Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
});

describe('DataManagement', () => {
  const sampleTodos: Todo[] = [
    {
      id: '1',
      text: 'テストタスク1',
      completed: false,
      createdAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      text: 'テストタスク2',
      completed: true,
      createdAt: new Date('2024-01-02T11:00:00Z'),
    },
  ];

  const mockOnImport = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    localStorageMock.clear();
    mockOnImport.mockClear();
    mockOnClear.mockClear();
    mockConfirm.mockClear();
  });

  const setup = (todos = sampleTodos) => {
    render(
      <DataManagement
        todos={todos}
        onImport={mockOnImport}
        onClear={mockOnClear}
      />
    );
  };

  it('データ管理ボタンが表示される', () => {
    setup();
    expect(screen.getByLabelText('データ管理メニュー')).toBeInTheDocument();
  });

  it('データ管理ボタンをクリックするとメニューが開く', () => {
    setup();
    fireEvent.click(screen.getByLabelText('データ管理メニュー'));
    expect(screen.getByText('📥 エクスポート (2件)')).toBeInTheDocument();
    expect(screen.getByText('📤 インポート')).toBeInTheDocument();
    expect(screen.getByText('🗑️ すべてクリア')).toBeInTheDocument();
  });

  it('タスクが0件の場合、エクスポートとクリアボタンが無効になる', () => {
    setup([]);
    fireEvent.click(screen.getByLabelText('データ管理メニュー'));
    
    expect(screen.getByText('📥 エクスポート (0件)')).toBeDisabled();
    expect(screen.getByText('🗑️ すべてクリア')).toBeDisabled();
  });

  it('クリアボタンをクリックして確認すると、onClearが呼ばれる', () => {
    mockConfirm.mockReturnValue(true);
    setup();
    
    fireEvent.click(screen.getByLabelText('データ管理メニュー'));
    fireEvent.click(screen.getByText('🗑️ すべてクリア'));
    
    expect(mockConfirm).toHaveBeenCalledWith('すべてのタスクデータを削除しますか？この操作は取り消せません。');
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('クリアボタンをクリックしてキャンセルすると、onClearが呼ばれない', () => {
    mockConfirm.mockReturnValue(false);
    setup();
    
    fireEvent.click(screen.getByLabelText('データ管理メニュー'));
    fireEvent.click(screen.getByText('🗑️ すべてクリア'));
    
    expect(mockConfirm).toHaveBeenCalled();
    expect(mockOnClear).not.toHaveBeenCalled();
  });

  it('保存済みタスク数が表示される', () => {
    setup();
    fireEvent.click(screen.getByLabelText('データ管理メニュー'));
    expect(screen.getByText('保存済み: 2件のタスク')).toBeInTheDocument();
  });
});
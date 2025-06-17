import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './TodoApp';

// 📝 crypto.randomUUIDをモック化
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => `mock-uuid-${Date.now()}-${Math.random()}`),
  },
});

describe('TodoApp - Priority Functionality', () => {
  beforeEach(() => {
    // 📝 Date.now()をモック化して一貫したテスト結果を得る
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('優先度付きでタスクを追加できる', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const prioritySelect = screen.getByDisplayValue('🟡 中');
    const addButton = screen.getByText('追加');

    // 📝 高優先度のタスクを追加
    fireEvent.change(input, { target: { value: '高優先度タスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(addButton);

    // 📝 タスクが表示され、優先度アイコンが正しく表示されることを確認
    expect(screen.getByText('高優先度タスク')).toBeInTheDocument();
    expect(screen.getByText('🔴')).toBeInTheDocument();
  });

  it('優先度順（高→中→低）でタスクが並び替えられる', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const prioritySelect = screen.getByDisplayValue('🟡 中');
    const addButton = screen.getByText('追加');

    // 📝 低、中、高の順でタスクを追加（逆順で追加）
    fireEvent.change(input, { target: { value: '低優先度タスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'low' } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: '中優先度タスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: '高優先度タスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(addButton);

    // 📝 タスクの順序を確認（高→中→低）
    const tasks = screen.getAllByText(/優先度タスク/);
    expect(tasks[0]).toHaveTextContent('高優先度タスク');
    expect(tasks[1]).toHaveTextContent('中優先度タスク');
    expect(tasks[2]).toHaveTextContent('低優先度タスク');
  });

  it('同じ優先度のタスクは作成日時順で並び替えられる', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const prioritySelect = screen.getByDisplayValue('🟡 中');
    const addButton = screen.getByText('追加');

    // 📝 同じ優先度のタスクを時間差で追加
    fireEvent.change(input, { target: { value: 'タスク1' } });
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    fireEvent.click(addButton);

    // 時間を進める
    jest.advanceTimersByTime(1000);

    fireEvent.change(input, { target: { value: 'タスク2' } });
    fireEvent.change(prioritySelect, { target: { value: 'medium' } });
    fireEvent.click(addButton);

    // 📝 新しいタスクが上に表示されることを確認
    const tasks = screen.getAllByText(/タスク[12]/);
    expect(tasks[0]).toHaveTextContent('タスク2');
    expect(tasks[1]).toHaveTextContent('タスク1');
  });

  it('フィルタ機能が優先度並び替えと組み合わせて正常に動作する', () => {
    render(<TodoApp />);
    
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const prioritySelect = screen.getByDisplayValue('🟡 中');
    const addButton = screen.getByText('追加');

    // 📝 複数の優先度でタスクを追加
    fireEvent.change(input, { target: { value: '高優先度タスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(addButton);

    fireEvent.change(input, { target: { value: '低優先度タスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'low' } });
    fireEvent.click(addButton);

    // 📝 1つのタスクを完了にする
    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    // 📝 アクティブフィルタを選択
    const activeFilter = screen.getByText('アクティブ');
    fireEvent.click(activeFilter);

    // 📝 完了していないタスクのみが表示されることを確認
    expect(screen.getByText('低優先度タスク')).toBeInTheDocument();
    expect(screen.queryByText('高優先度タスク')).not.toBeInTheDocument();
  });
});
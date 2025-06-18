import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './TodoApp';

// 📝 統合テスト: 検索機能とTodoアプリの統合
describe('TodoApp with Search Integration', () => {
  it('検索バーが表示される', () => {
    render(<TodoApp />);
    expect(screen.getByPlaceholderText(/タスクを検索/)).toBeInTheDocument();
  });

  it('タスクを追加して検索できる', () => {
    render(<TodoApp />);
    
    // 📝 タスクを追加
    const todoInput = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const addButton = screen.getByRole('button', { name: '追加' });
    
    fireEvent.change(todoInput, { target: { value: '重要なミーティング' } });
    fireEvent.click(addButton);
    
    // 📝 タスクが表示されることを確認
    expect(screen.getByText('重要なミーティング')).toBeInTheDocument();
    
    // 📝 検索機能をテスト
    const searchInput = screen.getByPlaceholderText(/タスクを検索/);
    fireEvent.change(searchInput, { target: { value: 'ミーティング' } });
    
    // 📝 検索結果が表示されることを確認（検索は即座に反映）
    expect(screen.getByText('重要なミーティング')).toBeInTheDocument();
  });

  it('検索に一致しないタスクは表示されない', () => {
    render(<TodoApp />);
    
    // 📝 複数のタスクを追加
    const todoInput = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const addButton = screen.getByRole('button', { name: '追加' });
    
    fireEvent.change(todoInput, { target: { value: '重要なミーティング' } });
    fireEvent.click(addButton);
    
    fireEvent.change(todoInput, { target: { value: 'ドキュメント作成' } });
    fireEvent.click(addButton);
    
    // 📝 特定のタスクを検索
    const searchInput = screen.getByPlaceholderText(/タスクを検索/);
    fireEvent.change(searchInput, { target: { value: 'ミーティング' } });
    
    // 📝 マッチするタスクのみ表示される
    expect(screen.getByText('重要なミーティング')).toBeInTheDocument();
    expect(screen.queryByText('ドキュメント作成')).not.toBeInTheDocument();
  });

  it('詳細フィルターボタンが表示される', () => {
    render(<TodoApp />);
    expect(screen.getByText('詳細フィルター')).toBeInTheDocument();
  });

  it('詳細フィルターを展開できる', () => {
    render(<TodoApp />);
    
    const advancedFilterButton = screen.getByText('詳細フィルター');
    fireEvent.click(advancedFilterButton);
    
    expect(screen.getByText('日付範囲')).toBeInTheDocument();
    expect(screen.getByText('詳細フィルターを閉じる')).toBeInTheDocument();
  });

  it('検索結果の統計が表示される', () => {
    render(<TodoApp />);
    
    // 📝 タスクを追加
    const todoInput = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const addButton = screen.getByRole('button', { name: '追加' });
    
    fireEvent.change(todoInput, { target: { value: 'テストタスク' } });
    fireEvent.click(addButton);
    
    // 📝 検索を実行
    const searchInput = screen.getByPlaceholderText(/タスクを検索/);
    fireEvent.change(searchInput, { target: { value: 'テスト' } });
    
    // 📝 検索結果の統計が表示される
    expect(screen.getByText(/検索結果/)).toBeInTheDocument();
    expect(screen.getByText(/全1件中/)).toBeInTheDocument();
  });

  it('検索クリア機能が動作する', () => {
    render(<TodoApp />);
    
    // 📝 タスクを追加
    const todoInput = screen.getByPlaceholderText('新しいタスクを入力してください...');
    const addButton = screen.getByRole('button', { name: '追加' });
    
    fireEvent.change(todoInput, { target: { value: 'テストタスク' } });
    fireEvent.click(addButton);
    
    // 📝 検索を実行
    const searchInput = screen.getByPlaceholderText(/タスクを検索/);
    fireEvent.change(searchInput, { target: { value: 'テスト' } });
    
    // 📝 検索統計が表示される
    expect(screen.getByText(/検索結果/)).toBeInTheDocument();
    
    // 📝 すべてのフィルターをクリア
    const clearAllButton = screen.getByText('すべてのフィルターをクリア');
    fireEvent.click(clearAllButton);
    
    // 📝 検索統計が消える
    expect(screen.queryByText(/検索結果/)).not.toBeInTheDocument();
  });
});
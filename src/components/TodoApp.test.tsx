import { render, screen, fireEvent } from '@testing-library/react';
import { TodoApp } from './TodoApp';

describe('TodoApp - Category and Tag functionality', () => {
  it('基本的な表示とTodo作成', () => {
    render(<TodoApp />);
    
    // 📝 主要な機能が表示される
    expect(screen.getByText('Todo App')).toBeInTheDocument();
    expect(screen.getByText('カテゴリ・タグフィルタ')).toBeInTheDocument();
    
    // 📝 タスクを入力・作成
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    
    const addButton = screen.getByRole('button', { name: '追加' });
    fireEvent.click(addButton);
    
    // 📝 Todoが表示される
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('フィルタ機能の動作確認', () => {
    render(<TodoApp />);
    
    // 📝 タスクを作成
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...');
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    
    const addButton = screen.getByRole('button', { name: '追加' });
    fireEvent.click(addButton);
    
    // 📝 タスクが表示されている
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    
    // 📝 完了済みフィルタをクリック
    const completedFilter = screen.getByText('完了済み');
    fireEvent.click(completedFilter);
    
    // 📝 完了していないタスクは表示されない
    expect(screen.queryByText('テストタスク')).not.toBeInTheDocument();
    
    // 📝 すべてフィルタに戻す
    const allFilter = screen.getByText('すべて');
    fireEvent.click(allFilter);
    
    // 📝 タスクが再び表示される
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });
});
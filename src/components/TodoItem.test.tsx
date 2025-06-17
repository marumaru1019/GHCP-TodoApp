import { render, screen, fireEvent } from '@testing-library/react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/types/todo';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'テストタスク',
    completed: false,
    createdAt: new Date('2024-01-01'),
    priority: 'medium',
  };

  const defaultProps = {
    todo: mockTodo,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('初期レンダリングでタスクの内容と優先度アイコンが表示される', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('🟡')).toBeInTheDocument(); // 📝 medium優先度のアイコン
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('編集')).toBeInTheDocument();
    expect(screen.getByText('削除')).toBeInTheDocument();
  });

  it('高優先度のタスクに赤いアイコンが表示される', () => {
    const highPriorityTodo = { ...mockTodo, priority: 'high' as const };
    render(<TodoItem {...defaultProps} todo={highPriorityTodo} />);
    expect(screen.getByText('🔴')).toBeInTheDocument();
  });

  it('低優先度のタスクに緑のアイコンが表示される', () => {
    const lowPriorityTodo = { ...mockTodo, priority: 'low' as const };
    render(<TodoItem {...defaultProps} todo={lowPriorityTodo} />);
    expect(screen.getByText('🟢')).toBeInTheDocument();
  });

  it('チェックボックスをクリックするとonToggleが呼ばれる', () => {
    render(<TodoItem {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultProps.onToggle).toHaveBeenCalledWith('1');
  });

  it('削除ボタンをクリックするとonDeleteが呼ばれる', () => {
    render(<TodoItem {...defaultProps} />);
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);
    expect(defaultProps.onDelete).toHaveBeenCalledWith('1');
  });

  it('編集ボタンをクリックすると編集モードになる', () => {
    render(<TodoItem {...defaultProps} />);
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);
    expect(screen.getByDisplayValue('テストタスク')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('編集モードでテキストを変更してEnterを押すとonEditが呼ばれる', () => {
    render(<TodoItem {...defaultProps} />);
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);
    
    const input = screen.getByDisplayValue('テストタスク');
    fireEvent.change(input, { target: { value: '更新されたタスク' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(defaultProps.onEdit).toHaveBeenCalledWith('1', '更新されたタスク');
  });

  it('完了済みタスクは取り消し線が表示される', () => {
    const completedTodo = { ...mockTodo, completed: true };
    render(<TodoItem {...defaultProps} todo={completedTodo} />);
    const taskText = screen.getByText('テストタスク');
    expect(taskText.className).toMatch(/line-through/);
  });
});
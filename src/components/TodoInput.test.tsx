import { render, screen, fireEvent } from '@testing-library/react';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  const setup = (onAddTodo = jest.fn()) => {
    render(<TodoInput onAddTodo={onAddTodo} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: '追加' });
    const prioritySelect = screen.getByDisplayValue('🟡 中') as HTMLSelectElement; // 📝 優先度セレクタを取得
    return { input, button, prioritySelect, onAddTodo };
  };

  it('初期レンダリングで入力欄、優先度選択、追加ボタンが表示される', () => {
    const { input, button, prioritySelect } = setup();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(prioritySelect).toBeInTheDocument();
    expect(button).toBeDisabled();
    expect(prioritySelect.value).toBe('medium'); // 📝 デフォルト優先度は中
  });

  it('入力欄にテキストを入力するとボタンが有効になる', () => {
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    expect(input.value).toBe('テストタスク');
    expect(button).not.toBeDisabled();
  });

  it('優先度を変更できる（最重要を含む）', () => {
    const { prioritySelect } = setup();
    fireEvent.change(prioritySelect, { target: { value: 'critical' } });
    expect(prioritySelect.value).toBe('critical');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    expect(prioritySelect.value).toBe('high');
  });

  it('EnterキーまたはボタンでonAddTodoが優先度付きで呼ばれ、入力がクリアされる', () => {
    const { input, button, prioritySelect, onAddTodo } = setup();
    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.click(button);
    expect(onAddTodo).toHaveBeenCalledWith('新しいタスク', 'high'); // 📝 優先度も渡されることを確認
    expect(input.value).toBe('');
    expect(prioritySelect.value).toBe('medium'); // 📝 優先度もリセットされることを確認
  });

  it('空文字や空白のみの場合はonAddTodoが呼ばれない', () => {
    const { input, button, onAddTodo } = setup();
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(button);
    expect(onAddTodo).not.toHaveBeenCalled();
    expect(input.value).toBe('   ');
  });

  it('EnterキーでonAddTodoが呼ばれる', () => {
    const { input, onAddTodo } = setup();
    fireEvent.change(input, { target: { value: 'エンター追加' } });
    fireEvent.submit(input.closest('form')!); // 📝 フォームのsubmitイベントを発火
    expect(onAddTodo).toHaveBeenCalledWith('エンター追加', 'medium'); // 📝 デフォルト優先度で呼ばれる
    expect(input.value).toBe('');
  });

  // 📝 TypeScript prop validation testは削除（実際にはランタイムでエラーにならない）
});

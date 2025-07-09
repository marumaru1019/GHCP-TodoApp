import { render, screen, fireEvent } from '@testing-library/react';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  const setup = (onAddTodo = jest.fn()) => {
    render(<TodoInput onAddTodo={onAddTodo} />);
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: '追加' });
    const prioritySelect = screen.getByDisplayValue('中') as HTMLSelectElement; // 📝 優先度セレクトボックスを追加
    return { input, button, onAddTodo, prioritySelect };
  };

  it('初期レンダリングで入力欄と追加ボタンが表示される', () => {
    const { input, button, prioritySelect } = setup();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(prioritySelect).toBeInTheDocument(); // 📝 優先度セレクトボックスのテスト
    expect(button).toBeDisabled();
  });

  it('入力欄にテキストを入力するとボタンが有効になる', () => {
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: 'テストタスク' } });
    expect(input.value).toBe('テストタスク');
    expect(button).not.toBeDisabled();
  });

  it('EnterキーまたはボタンでonAddTodoが呼ばれ、入力がクリアされる', () => {
    const { input, button, onAddTodo } = setup();
    fireEvent.change(input, { target: { value: '新しいタスク' } });
    fireEvent.click(button);
    expect(onAddTodo).toHaveBeenCalledWith('新しいタスク', 'medium'); // 📝 優先度パラメータを追加
    expect(input.value).toBe('');
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
    fireEvent.submit(input.closest('form')!); // 📝 formのsubmitイベントを使用
    expect(onAddTodo).toHaveBeenCalledWith('エンター追加', 'medium'); // 📝 優先度パラメータを追加
    expect(input.value).toBe('');
  });

  // 📝 優先度選択のテストを追加
  it('優先度を変更できる', () => {
    const { input, button, onAddTodo, prioritySelect } = setup();
    fireEvent.change(prioritySelect, { target: { value: 'high' } });
    fireEvent.change(input, { target: { value: '高優先度タスク' } });
    fireEvent.click(button);
    expect(onAddTodo).toHaveBeenCalledWith('高優先度タスク', 'high');
  });
});

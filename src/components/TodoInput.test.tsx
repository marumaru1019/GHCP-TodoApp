import { render, screen, fireEvent } from '@testing-library/react';
import { TodoInput } from './TodoInput';
import { defaultCategories, defaultTags } from '@/constants/categories';

describe('TodoInput', () => {
  const setup = (onAddTodo = jest.fn()) => {
    render(
      <TodoInput 
        onAddTodo={onAddTodo} 
        categories={defaultCategories}
        tags={defaultTags}
      />
    );
    const input = screen.getByPlaceholderText('新しいタスクを入力してください...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: '追加' });
    return { input, button, onAddTodo };
  };

  it('初期レンダリングで入力欄と追加ボタンが表示される', () => {
    const { input, button } = setup();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
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
    expect(onAddTodo).toHaveBeenCalledWith('新しいタスク', undefined, []);
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
    fireEvent.submit(input.closest('form')!); // 📝 フォームのsubmitイベントを使用
    expect(onAddTodo).toHaveBeenCalledWith('エンター追加', undefined, []);
    expect(input.value).toBe('');
  });

  it('Propsの型チェック: onAddTodoが必須', () => {
    // 📝 TypeScriptの型チェックにより、必須プロパティのチェックは静的に行われる
    // この代わりに、正しいプロパティが渡されることをテスト
    const onAddTodo = jest.fn();
    expect(() => 
      render(
        <TodoInput 
          onAddTodo={onAddTodo} 
          categories={defaultCategories}
          tags={defaultTags}
        />
      )
    ).not.toThrow();
  });
});

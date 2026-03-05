import { render, screen, fireEvent } from '@testing-library/react';
import { TodoFilter, TodoSortType } from './TodoFilter';
import { TodoFilter as TodoFilterType } from '@/types/todo';

describe('TodoFilter', () => {
  const defaultProps = {
    currentFilter: 'all' as TodoFilterType,
    onFilterChange: jest.fn(),
    activeTodosCount: 2,
    completedTodosCount: 3,
    onClearCompleted: jest.fn(),
    currentSort: 'priority' as TodoSortType, // 📝 ソート関連のプロパティを追加
    onSortChange: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('初期レンダリングでフィルターボタンとカウントが表示される', () => {
    render(<TodoFilter {...defaultProps} />);
    expect(screen.getByText('すべて')).toBeInTheDocument();
    expect(screen.getByText('アクティブ')).toBeInTheDocument();
    expect(screen.getByText('完了済み')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // active count
    expect(screen.getByText('3')).toBeInTheDocument(); // completed count
    expect(screen.getByText('完了済みを削除')).toBeInTheDocument();
  });

  it('フィルターボタンをクリックするとonFilterChangeが呼ばれる', () => {
    render(<TodoFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('アクティブ'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('active');
    fireEvent.click(screen.getByText('完了済み'));
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('completed');
  });

  it('完了済みを削除ボタンをクリックするとonClearCompletedが呼ばれる', () => {
    render(<TodoFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('完了済みを削除'));
    expect(defaultProps.onClearCompleted).toHaveBeenCalled();
  });

  it('activeTodosCountとcompletedTodosCountが0のときバッジと削除ボタンが表示されない', () => {
    render(
      <TodoFilter {...defaultProps} activeTodosCount={0} completedTodosCount={0} />
    );
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    expect(screen.queryByText('完了済みを削除')).not.toBeInTheDocument();
  });

  it('currentFilterに応じて選択中のボタンにクラスが付与される', () => {
    render(<TodoFilter {...defaultProps} currentFilter="active" />);
    const activeBtn = screen.getByText('アクティブ');
    expect(activeBtn.className).toMatch(/bg-white|dark:bg-gray-600/);
  });

  // 📝 ソート機能のテストを追加
  it('ソートボタンが表示される', () => {
    render(<TodoFilter {...defaultProps} />);
    expect(screen.getByText('作成順')).toBeInTheDocument();
    expect(screen.getByText('優先度順')).toBeInTheDocument();
  });

  it('ソートボタンをクリックするとonSortChangeが呼ばれる', () => {
    render(<TodoFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('作成順'));
    expect(defaultProps.onSortChange).toHaveBeenCalledWith('default');
  });
});

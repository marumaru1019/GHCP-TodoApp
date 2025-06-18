import { renderHook, act } from '@testing-library/react';
import { useSearch } from './useSearch';
import { Todo } from '@/types/todo';

// 📝 テスト用のサンプルTodo
const createMockTodos = (): Todo[] => [
  {
    id: '1',
    text: '重要なミーティングの準備',
    completed: false,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    text: 'プロジェクトのドキュメント作成',
    completed: true,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    text: 'デザインレビュー',
    completed: false,
    createdAt: new Date('2024-01-03'),
  },
];

describe('useSearch', () => {
  it('初期状態が正しく設定される', () => {
    const { result } = renderHook(() => useSearch());
    
    expect(result.current.searchOptions.query).toBe('');
    expect(result.current.searchOptions.fuzzySearch).toBe(true);
    expect(result.current.filterOptions.status).toBe('all');
    expect(result.current.searchHistory).toHaveLength(0);
  });

  it('検索オプションが更新される', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: 'test',
        caseSensitive: true,
      });
    });

    expect(result.current.searchOptions.query).toBe('test');
    expect(result.current.searchOptions.caseSensitive).toBe(true);
  });

  it('フィルターオプションが更新される', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setFilterOptions({
        ...result.current.filterOptions,
        status: 'active',
      });
    });

    expect(result.current.filterOptions.status).toBe('active');
  });

  it('検索条件なしで全てのTodoを返す', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    const searchResults = result.current.searchTodos(todos);
    
    expect(searchResults).toHaveLength(3);
    expect(searchResults.every(r => r.score === 1)).toBe(true);
  });

  it('テキスト検索が正しく動作する', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: 'ミーティング',
      });
    });

    const searchResults = result.current.searchTodos(todos);
    
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].todo.text).toContain('ミーティング');
  });

  it('ステータスフィルターが正しく動作する', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setFilterOptions({
        ...result.current.filterOptions,
        status: 'active',
      });
    });

    const searchResults = result.current.searchTodos(todos);
    
    expect(searchResults).toHaveLength(2);
    expect(searchResults.every(r => !r.todo.completed)).toBe(true);
  });

  it('日付範囲フィルターが正しく動作する', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setFilterOptions({
        ...result.current.filterOptions,
        dateRange: {
          type: 'created',
          start: new Date('2024-01-02'),
        },
      });
    });

    const searchResults = result.current.searchTodos(todos);
    
    expect(searchResults).toHaveLength(2);
    expect(searchResults.every(r => r.todo.createdAt >= new Date('2024-01-02'))).toBe(true);
  });

  it('複合検索が正しく動作する', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: 'status:active',
      });
    });

    const searchResults = result.current.searchTodos(todos);
    
    expect(searchResults).toHaveLength(2);
    expect(searchResults.every(r => !r.todo.completed)).toBe(true);
  });

  it('検索をクリアできる', () => {
    const { result } = renderHook(() => useSearch());
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: 'test',
      });
    });

    expect(result.current.searchOptions.query).toBe('test');

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.searchOptions.query).toBe('');
    expect(result.current.filterOptions.status).toBe('all');
  });

  it('検索履歴が正しく管理される', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: 'test query',
      });
    });

    // 📝 検索を実行して履歴に追加
    act(() => {
      result.current.searchTodos(todos);
    });

    expect(result.current.searchHistory).toHaveLength(1);
    expect(result.current.searchHistory[0].query).toBe('test query');

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.searchHistory).toHaveLength(0);
  });

  it('ファジー検索が正しく動作する', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: 'ミーテング', // 微妙に間違った文字
        fuzzySearch: true,
      });
    });

    const searchResults = result.current.searchTodos(todos);
    
    // ファジー検索により部分的にマッチするものが見つかる
    expect(searchResults.length).toBeGreaterThan(0);
  });

  it('正規表現検索が正しく動作する', () => {
    const { result } = renderHook(() => useSearch());
    const todos = createMockTodos();
    
    act(() => {
      result.current.setSearchOptions({
        ...result.current.searchOptions,
        query: '.*ミーティング.*',
        useRegex: true,
      });
    });

    const searchResults = result.current.searchTodos(todos);
    
    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].todo.text).toContain('ミーティング');
  });
});
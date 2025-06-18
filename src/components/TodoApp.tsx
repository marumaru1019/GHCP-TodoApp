'use client';

import { useState } from 'react';
import { Todo, TodoFilter } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import { TodoFilter as TodoFilterComponent } from './TodoFilter';
import { SearchBar } from './SearchBar';
import { AdvancedFilter } from './AdvancedFilter';
import { useSearch } from '@/hooks/useSearch';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // 🔍 検索機能の初期化
  const {
    searchOptions,
    setSearchOptions,
    filterOptions,
    setFilterOptions,
    searchTodos,
    searchHistory,
    clearSearch,
    clearHistory,
  } = useSearch();

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const editTodo = (id: string, newText: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // 📝 基本フィルターと高度検索の統合
  const getFilteredTodos = () => {
    // 🎯 まず基本フィルターを適用
    const baseTodos = todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });

    // 🔍 検索・高度フィルターを適用
    const searchResults = searchTodos(baseTodos);
    
    return searchResults;
  };

  const filteredResults = getFilteredTodos();
  const filteredTodos = filteredResults.map(result => result.todo);

  // 📝 検索結果数とフィルター状態の表示用
  const hasActiveSearch = searchOptions.query || 
    filterOptions.dateRange.start || 
    filterOptions.dateRange.end;

  // 🧹 検索とフィルターのクリア
  const clearAllFilters = () => {
    clearSearch();
    setFilter('all');
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Todo App
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <TodoInput onAddTodo={addTodo} />
        
        {/* 🔍 検索バー */}
        <div className="mt-6">
          <SearchBar
            searchOptions={searchOptions}
            onSearchOptionsChange={setSearchOptions}
            searchHistory={searchHistory}
            onClearSearch={clearSearch}
            onClearHistory={clearHistory}
          />
        </div>

        {/* 🎛️ 詳細フィルター切り替え */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>{showAdvancedSearch ? '詳細フィルターを閉じる' : '詳細フィルター'}</span>
          </button>

          {hasActiveSearch && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              すべてのフィルターをクリア
            </button>
          )}
        </div>

        {/* 📝 詳細フィルター */}
        {showAdvancedSearch && (
          <div className="mt-4">
            <AdvancedFilter
              filterOptions={filterOptions}
              onFilterOptionsChange={setFilterOptions}
              onClearFilters={clearSearch}
            />
          </div>
        )}

        {/* 📊 検索結果の統計 */}
        {hasActiveSearch && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              🔍 {filteredTodos.length}件の検索結果 (全{todos.length}件中)
              {searchOptions.query && (
                <span className="ml-2 font-medium">
                  検索: &quot;{searchOptions.query}&quot;
                </span>
              )}
            </p>
          </div>
        )}
        
        {/* 📝 基本フィルター */}
        <div className="mt-6">
          <TodoFilterComponent
            currentFilter={filter}
            onFilterChange={setFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* 📝 Todoリスト */}
        <div className="mt-6 space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {hasActiveSearch ? (
                '検索条件に一致するタスクが見つかりませんでした。'
              ) : (
                <>
                  {filter === 'active' && 'アクティブなタスクはありません'}
                  {filter === 'completed' && '完了したタスクはありません'}
                  {filter === 'all' && 'タスクがありません。新しいタスクを追加してください。'}
                </>
              )}
            </p>
          ) : (
            filteredResults.map((result) => (
              <div key={result.todo.id} className="relative">
                <TodoItem
                  todo={result.todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
                {/* 📝 検索スコア表示（デバッグ用） */}
                {hasActiveSearch && result.score < 1 && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded">
                    スコア: {Math.round(result.score * 100)}%
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
            {activeTodosCount}個のアクティブなタスク、{completedTodosCount}個の完了済みタスク
          </div>
        )}
      </div>
    </div>
  );
}

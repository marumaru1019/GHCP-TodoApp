'use client';

import { useState } from 'react';
import { Todo, TodoFilter, TodoPriority } from '@/types/todo';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import { TodoFilter as TodoFilterComponent } from './TodoFilter';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');

  // 📝 優先度付きでタスクを追加する関数
  const addTodo = (text: string, priority: TodoPriority = 'medium') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority, // 📝 優先度を追加
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

  // 📝 優先度による並び替え関数（最重要を追加）
  const sortByPriority = (todos: Todo[]) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return [...todos].sort((a, b) => {
      // 📝 優先度で並び替え（最重要 > 高 > 中 > 低）
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      // 📝 同じ優先度なら作成日時で並び替え（新しい順）
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  };

  const filteredTodos = sortByPriority(
    todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    })
  );

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Todo App
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <TodoInput onAddTodo={addTodo} />
        
        <div className="mt-6">
          <TodoFilterComponent
            currentFilter={filter}
            onFilterChange={setFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={clearCompleted}
          />
        </div>

        <div className="mt-6 space-y-2">
          {filteredTodos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {filter === 'active' && 'アクティブなタスクはありません'}
              {filter === 'completed' && '完了したタスクはありません'}
              {filter === 'all' && 'タスクがありません。新しいタスクを追加してください。'}
            </p>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
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

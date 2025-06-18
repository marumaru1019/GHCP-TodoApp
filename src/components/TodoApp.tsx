'use client';

import { useState } from 'react';
import { Todo, TodoFilter, TodoCategory, TodoTag } from '@/types/todo';
import { defaultCategories, defaultTags } from '@/constants/categories';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import { TodoFilter as TodoFilterComponent } from './TodoFilter';

import { CategoryTagFilter } from './CategoryTagFilter';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [categories] = useState<TodoCategory[]>(defaultCategories);
  const [tags, setTags] = useState<TodoTag[]>(defaultTags);
  
  // 📝 カテゴリ・タグフィルタの状態
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 📝 addTodo関数を拡張してカテゴリとタグに対応
  const addTodo = (text: string, category?: TodoCategory, selectedTags?: TodoTag[]) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      category,
      tags: selectedTags || [],
    };
    
    // 📝 新しいタグがあれば tags 配列に追加
    if (selectedTags) {
      const newTags = selectedTags.filter(tag => 
        !tags.find(existingTag => existingTag.id === tag.id)
      );
      if (newTags.length > 0) {
        setTags(prev => [...prev, ...newTags]);
      }
    }
    
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

  // 📝 拡張されたフィルタリングロジック - 完了状態、カテゴリ、タグ全てに対応
  const filteredTodos = todos.filter(todo => {
    // 📝 完了状態フィルタ
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    
    // 📝 カテゴリフィルタ
    if (selectedCategories.length > 0) {
      if (!todo.category || !selectedCategories.includes(todo.category.id)) {
        return false;
      }
    }
    
    // 📝 タグフィルタ（選択されたタグのいずれかを含む場合にマッチ）
    if (selectedTags.length > 0) {
      const todoTagIds = todo.tags.map(tag => tag.id);
      if (!selectedTags.some(tagId => todoTagIds.includes(tagId))) {
        return false;
      }
    }
    
    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">
        Todo App
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <TodoInput 
          onAddTodo={addTodo} 
          categories={categories}
          tags={tags}
        />
        
        <div className="mt-6">
          <TodoFilterComponent
            currentFilter={filter}
            onFilterChange={setFilter}
            activeTodosCount={activeTodosCount}
            completedTodosCount={completedTodosCount}
            onClearCompleted={clearCompleted}
          />
        </div>

        {/* 📝 カテゴリ・タグフィルタの追加 */}
        <div className="mt-6">
          <CategoryTagFilter
            categories={categories}
            tags={tags}
            selectedCategories={selectedCategories}
            selectedTags={selectedTags}
            onCategoryFilterChange={setSelectedCategories}
            onTagFilterChange={setSelectedTags}
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

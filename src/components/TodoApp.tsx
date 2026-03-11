'use client';

import { useState } from 'react';
import { Todo, TodoFilter } from '@/types/todo';
import { sortTodosByDueDate } from '@/utils/dateUtils';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import { TodoFilter as TodoFilterComponent } from './TodoFilter';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');

  const addTodo = (text: string, dueDate?: Date) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      dueDate, // 📝 Include due date if provided
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

  const editTodo = (id: string, newText: string, dueDate?: Date) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: newText.trim(), dueDate } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    if (filter === 'overdue') return todo.dueDate && new Date() > todo.dueDate && !todo.completed;
    if (filter === 'today') {
      if (!todo.dueDate || todo.completed) return false;
      const today = new Date();
      const dueDate = new Date(todo.dueDate);
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return today.getTime() === dueDate.getTime();
    }
    if (filter === 'no-due-date') return !todo.dueDate && !todo.completed;
    return true;
  });

  // 📝 Sort todos by due date (earliest first)
  const sortedTodos = sortTodosByDueDate(filteredTodos);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  
  // 📝 Calculate counts for due date filters
  const overdueTodosCount = todos.filter(todo => 
    todo.dueDate && new Date() > todo.dueDate && !todo.completed
  ).length;
  
  const todayTodosCount = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return today.getTime() === dueDate.getTime();
  }).length;
  
  const noDueDateTodosCount = todos.filter(todo => 
    !todo.dueDate && !todo.completed
  ).length;

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
            overdueTodosCount={overdueTodosCount}
            todayTodosCount={todayTodosCount}
            noDueDateTodosCount={noDueDateTodosCount}
            onClearCompleted={clearCompleted}
          />
        </div>

        <div className="mt-6 space-y-2">
          {sortedTodos.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {filter === 'active' && 'アクティブなタスクはありません'}
              {filter === 'completed' && '完了したタスクはありません'}
              {filter === 'overdue' && '期限切れのタスクはありません'}
              {filter === 'today' && '今日期限のタスクはありません'}
              {filter === 'no-due-date' && '期限なしのタスクはありません'}
              {filter === 'all' && 'タスクがありません。新しいタスクを追加してください。'}
            </p>
          ) : (
            sortedTodos.map(todo => (
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

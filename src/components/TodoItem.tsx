'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { formatDueDate, getDueDateStatus, getDueDateClasses } from '@/utils/dateUtils';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string, dueDate?: Date) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(todo.dueDate);

  const handleEdit = () => {
    if (editText.trim() && (editText !== todo.text || editDueDate !== todo.dueDate)) {
      onEdit(todo.id, editText, editDueDate);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setEditDueDate(todo.dueDate);
      setIsEditing(false);
    }
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      date.setHours(23, 59, 59, 999); // 🚩 Set to end of day
      setEditDueDate(date);
    } else {
      setEditDueDate(undefined);
    }
  };

  // 📝 Get due date display info
  const dueDateInfo = todo.dueDate ? {
    text: formatDueDate(todo.dueDate),
    status: getDueDateStatus(todo.dueDate),
    classes: getDueDateClasses(getDueDateStatus(todo.dueDate))
  } : null;

  return (
    <div className={`p-3 border border-gray-200 dark:border-gray-600 rounded-lg
                     bg-gray-50 dark:bg-gray-700 transition-all duration-200
                     ${todo.completed ? 'opacity-75' : ''}`}>
      
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}          className="w-5 h-5 text-[#ff0033] bg-gray-100 border-gray-300 rounded 
                     focus:ring-[#ff0033] dark:focus:ring-[#ff4d6e] dark:ring-offset-gray-800 
                     focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        
        {isEditing ? (
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyDown}
              autoFocus              className="w-full px-2 py-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600
                         border border-gray-300 dark:border-gray-500 rounded focus:outline-none 
                         focus:ring-2 focus:ring-[#ff0033]"
            />
            <div className="flex gap-2 items-center">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                期限:
              </label>
              <input
                type="date"
                value={editDueDate ? formatDateForInput(editDueDate) : ''}
                onChange={handleDateChange}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded
                           bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-1 focus:ring-[#ff0033]"
              />
              <button
                type="button"
                onClick={() => setEditDueDate(undefined)}
                className="px-2 py-1 text-xs text-gray-600 dark:text-gray-400 
                           hover:text-gray-800 dark:hover:text-gray-200"
              >
                クリア
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <span
              onClick={() => setIsEditing(true)}
              className={`cursor-text select-none block ${
                todo.completed 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {todo.text}
            </span>
            
            {/* 📝 Due date display */}
            {dueDateInfo && (
              <div className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${dueDateInfo.classes}`}>
                {dueDateInfo.text}
              </div>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}            className="px-3 py-1 text-sm text-[#ff0033] dark:text-[#ff4d6e] hover:bg-[#fff0f3] 
                       dark:hover:bg-[#4d000f] rounded transition-colors duration-200"
          >
            {isEditing ? 'キャンセル' : '編集'}
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 
                       dark:hover:bg-red-900 rounded transition-colors duration-200"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}

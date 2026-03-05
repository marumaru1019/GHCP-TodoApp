'use client';

import { useState } from 'react';
import { Todo, TodoPriority } from '@/types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.text) {
      onEdit(todo.id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  // 📝 優先度に応じたスタイルとアイコンの定義
  const getPriorityConfig = (priority: TodoPriority) => {
    switch (priority) {
      case 'high':
        return {
          icon: '🔥', // 高優先度: 炎アイコン
          borderColor: 'border-l-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          textColor: 'text-red-600 dark:text-red-400',
          label: '高'
        };
      case 'medium':
        return {
          icon: '⚡', // 中優先度: 稲妻アイコン
          borderColor: 'border-l-yellow-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          textColor: 'text-yellow-600 dark:text-yellow-400',
          label: '中'
        };
      case 'low':
        return {
          icon: '🍃', // 低優先度: 葉っぱアイコン
          borderColor: 'border-l-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-600 dark:text-green-400',
          label: '低'
        };
    }
  };

  const priorityConfig = getPriorityConfig(todo.priority);

  return (
    <div className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg
                     border-l-4 ${priorityConfig.borderColor} ${priorityConfig.bgColor}
                     transition-all duration-200 ${todo.completed ? 'opacity-75' : ''}`}>
      
      {/* 📝 優先度インジケーター */}
      <div className={`flex items-center gap-1 ${priorityConfig.textColor}`} title={`優先度: ${priorityConfig.label}`}>
        <span className="text-lg">{priorityConfig.icon}</span>
        <span className="text-xs font-medium hidden sm:inline">{priorityConfig.label}</span>
      </div>
      
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-5 h-5 text-[#ff0033] bg-gray-100 border-gray-300 rounded 
                   focus:ring-[#ff0033] dark:focus:ring-[#ff4d6e] dark:ring-offset-gray-800 
                   focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 px-2 py-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-600
                     border border-gray-300 dark:border-gray-500 rounded focus:outline-none 
                     focus:ring-2 focus:ring-[#ff0033]"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 cursor-text select-none ${
            todo.completed 
              ? 'line-through text-gray-500 dark:text-gray-400' 
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {todo.text}
        </span>
      )}
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-3 py-1 text-sm text-[#ff0033] dark:text-[#ff4d6e] hover:bg-[#fff0f3] 
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
  );
}

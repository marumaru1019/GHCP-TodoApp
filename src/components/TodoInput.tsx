'use client';

import { useState } from 'react';
import { TodoPriority } from '@/types/todo';

interface TodoInputProps {
  onAddTodo: (text: string, priority: TodoPriority) => void; // 📝 優先度パラメータを追加
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium'); // 📝 デフォルトは中優先度

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue, priority);
      setInputValue('');
      setPriority('medium'); // 📝 追加後は中優先度にリセット
    }
  };

  // 📝 優先度の表示ラベルとスタイル定義
  const priorityOptions = [
    { value: 'high', label: '高', color: 'text-red-600 dark:text-red-400' },
    { value: 'medium', label: '中', color: 'text-yellow-600 dark:text-yellow-400' },
    { value: 'low', label: '低', color: 'text-green-600 dark:text-green-400' }
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="新しいタスクを入力してください..."
        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent
                   placeholder-gray-500 dark:placeholder-gray-400"
      />
      
      {/* 📝 優先度選択ドロップダウン */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as TodoPriority)}
        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                   focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
      >
        {priorityOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      <button
        type="submit"
        disabled={!inputValue.trim()}
        className="px-6 py-2 bg-[#ff0033] hover:bg-[#e6002e] disabled:bg-gray-300 dark:disabled:bg-gray-600
                   text-white rounded-lg font-medium transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:ring-offset-2
                   disabled:cursor-not-allowed"
      >
        追加
      </button>
    </form>
  );
}

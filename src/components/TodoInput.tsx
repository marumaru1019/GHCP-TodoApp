'use client';

import { useState } from 'react';

interface TodoInputProps {
  onAddTodo: (text: string, dueDate?: Date) => void;
}

export function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue, dueDate);
      setInputValue('');
      setDueDate(undefined);
      setShowDatePicker(false);
    }
  };

  // 📝 Quick date selection helpers
  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(23, 59, 59, 999); // 🚩 Set to end of day
    setDueDate(date);
    setShowDatePicker(false);
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      date.setHours(23, 59, 59, 999); // 🚩 Set to end of day
      setDueDate(date);
    } else {
      setDueDate(undefined);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="新しいタスクを入力してください..."          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent
                     placeholder-gray-500 dark:placeholder-gray-400"
        />        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
        >
          📅
        </button>
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
      
      {/* 📝 Due date selection section */}
      {showDatePicker && (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setQuickDate(0)}
                className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 
                           rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                今日
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(1)}
                className="px-3 py-1 text-sm bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 
                           rounded hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                明日
              </button>
              <button
                type="button"
                onClick={() => setQuickDate(7)}
                className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 
                           rounded hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors"
              >
                来週
              </button>
              <button
                type="button"
                onClick={() => { setDueDate(undefined); setShowDatePicker(false); }}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 
                           rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                期限なし
              </button>
            </div>
            
            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-700 dark:text-gray-300">
                カスタム日付:
              </label>
              <input
                type="date"
                value={dueDate ? formatDateForInput(dueDate) : ''}
                onChange={handleDateChange}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded
                           bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-[#ff0033]"
              />
            </div>
            
            {dueDate && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                期限: {dueDate.getMonth() + 1}月{dueDate.getDate()}日
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

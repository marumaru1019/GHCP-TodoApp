'use client';

import { TodoFilter as TodoFilterType } from '@/types/todo';

interface TodoFilterProps {
  currentFilter: TodoFilterType;
  onFilterChange: (filter: TodoFilterType) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  overdueTodosCount: number; // 📝 New count for overdue todos
  todayTodosCount: number; // 📝 New count for today's todos
  noDueDateTodosCount: number; // 📝 New count for todos without due date
  onClearCompleted: () => void;
}

export function TodoFilter({ 
  currentFilter, 
  onFilterChange, 
  activeTodosCount, 
  completedTodosCount,
  overdueTodosCount,
  todayTodosCount,
  noDueDateTodosCount,
  onClearCompleted 
}: TodoFilterProps) {
  const basicFilters: { key: TodoFilterType; label: string }[] = [
    { key: 'all', label: 'すべて' },
    { key: 'active', label: 'アクティブ' },
    { key: 'completed', label: '完了済み' },
  ];

  const dueDateFilters: { key: TodoFilterType; label: string; count: number; color: string }[] = [
    { key: 'overdue', label: '期限切れ', count: overdueTodosCount, color: 'red' },
    { key: 'today', label: '今日期限', count: todayTodosCount, color: 'orange' },
    { key: 'no-due-date', label: '期限なし', count: noDueDateTodosCount, color: 'gray' },
  ];

  return (
    <div className="space-y-4">
      {/* 📝 Basic filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {basicFilters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                currentFilter === key
                  ? 'bg-white dark:bg-gray-600 text-[#ff0033] dark:text-[#ff4d6e] shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {label}
              {key === 'active' && activeTodosCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                  {activeTodosCount}
                </span>
              )}
              {key === 'completed' && completedTodosCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
                  {completedTodosCount}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {completedTodosCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 
                       dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
          >
            完了済みを削除
          </button>
        )}
      </div>

      {/* 📝 Due date filters */}
      <div className="flex flex-wrap gap-2">
        {dueDateFilters.map(({ key, label, count, color }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
              currentFilter === key
                ? `bg-${color}-100 dark:bg-${color}-900/30 text-${color}-800 dark:text-${color}-200 ring-2 ring-${color}-300`
                : `text-${color}-600 dark:text-${color}-400 hover:bg-${color}-50 dark:hover:bg-${color}-900/20`
            }`}
          >
            {label}
            {count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 bg-${color}-200 dark:bg-${color}-800 text-${color}-800 dark:text-${color}-200 rounded text-xs`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

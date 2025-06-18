'use client';

import { useState } from 'react';
import { FilterOptions } from '@/hooks/useSearch';

interface AdvancedFilterProps {
  filterOptions: FilterOptions;
  onFilterOptionsChange: (options: FilterOptions) => void;
  onClearFilters: () => void;
}

export function AdvancedFilter({
  filterOptions,
  onFilterOptionsChange,
  onClearFilters,
}: AdvancedFilterProps) {
  const [showDateFilter, setShowDateFilter] = useState(false);

  // 📝 日付範囲の更新
  const updateDateRange = (field: 'start' | 'end', value: string) => {
    const date = value ? new Date(value) : undefined;
    onFilterOptionsChange({
      ...filterOptions,
      dateRange: {
        ...filterOptions.dateRange,
        [field]: date,
      },
    });
  };

  // 📝 日付範囲タイプの更新
  const updateDateRangeType = (type: 'created' | 'updated' | 'due') => {
    onFilterOptionsChange({
      ...filterOptions,
      dateRange: {
        ...filterOptions.dateRange,
        type,
      },
    });
  };

  // 📝 日付をYYYY-MM-DD形式に変換
  const formatDateForInput = (date?: Date): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // 📝 アクティブなフィルター数をカウント
  const activeFilterCount = 
    (filterOptions.dateRange.start ? 1 : 0) +
    (filterOptions.dateRange.end ? 1 : 0) +
    filterOptions.categories.length +
    filterOptions.tags.length +
    filterOptions.priority.length;

  return (
    <div className="space-y-4">
      {/* 📝 フィルターヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            詳細フィルター
          </h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
              {activeFilterCount}個のフィルター
            </span>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
          >
            すべてクリア
          </button>
        )}
      </div>

      {/* 📅 日付フィルター */}
      <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
        <button
          onClick={() => setShowDateFilter(!showDateFilter)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            日付範囲
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              showDateFilter ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showDateFilter && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-600 space-y-3">
            {/* 📝 日付タイプ選択 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                日付の種類
              </label>
              <select
                value={filterOptions.dateRange.type}
                onChange={(e) => updateDateRangeType(e.target.value as 'created' | 'updated' | 'due')}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="created">作成日</option>
                <option value="updated">更新日</option>
                <option value="due">期限日</option>
              </select>
            </div>

            {/* 📝 開始日 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                開始日
              </label>
              <input
                type="date"
                value={formatDateForInput(filterOptions.dateRange.start)}
                onChange={(e) => updateDateRange('start', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* 📝 終了日 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                終了日
              </label>
              <input
                type="date"
                value={formatDateForInput(filterOptions.dateRange.end)}
                onChange={(e) => updateDateRange('end', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </div>

      {/* 📝 アクティブフィルターの表示 */}
      {activeFilterCount > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400">
            適用中のフィルター:
          </h4>
          <div className="flex flex-wrap gap-2">
            {filterOptions.dateRange.start && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {filterOptions.dateRange.type}: {formatDateForInput(filterOptions.dateRange.start)}以降
                <button
                  onClick={() => updateDateRange('start', '')}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            )}
            {filterOptions.dateRange.end && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                {filterOptions.dateRange.type}: {formatDateForInput(filterOptions.dateRange.end)}以前
                <button
                  onClick={() => updateDateRange('end', '')}
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchOptions, SearchHistory } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  searchOptions: SearchOptions;
  onSearchOptionsChange: (options: SearchOptions) => void;
  searchHistory: SearchHistory[];
  onClearSearch: () => void;
  onClearHistory: () => void;
  placeholder?: string;
}

export function SearchBar({
  searchOptions,
  onSearchOptionsChange,
  searchHistory,
  onClearSearch,
  onClearHistory,
  placeholder = 'タスクを検索... (例: "重要な" tag:仕事 created:>2024-01-01)',
}: SearchBarProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 📝 検索入力のデバウンス処理（将来使用予定）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const debouncedQuery = useDebounce(searchOptions.query, 300);

  // 🎯 検索クエリの更新
  const handleQueryChange = (query: string) => {
    onSearchOptionsChange({
      ...searchOptions,
      query,
    });
  };

  // 📝 検索オプションの切り替え
  const toggleOption = (option: keyof Omit<SearchOptions, 'query' | 'searchFields'>) => {
    onSearchOptionsChange({
      ...searchOptions,
      [option]: !searchOptions[option],
    });
  };

  // 🔍 履歴から検索クエリを選択
  const selectFromHistory = (query: string) => {
    handleQueryChange(query);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  // 📝 キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F で検索フィールドにフォーカス
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      
      // Escape で検索をクリア
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onClearSearch();
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClearSearch]);

  // 📝 ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3">
      {/* 📝 メイン検索バー */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchOptions.query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setShowHistory(searchHistory.length > 0)}
            placeholder={placeholder}
            className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 
                     rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400"
          />
          
          {/* 🔍 検索アイコン */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* 🎛️ 右側のボタン群 */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
            {/* 📝 検索オプションボタン */}
            <button
              onClick={() => setShowOptions(!showOptions)}
              className={`p-2 rounded-md transition-colors ${
                showOptions || searchOptions.useRegex || searchOptions.fuzzySearch || searchOptions.caseSensitive
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title="検索オプション"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </button>

            {/* 🧹 クリアボタン */}
            {searchOptions.query && (
              <button
                onClick={onClearSearch}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md transition-colors"
                title="検索をクリア (Esc)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 📜 検索履歴ドロップダウン */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">検索履歴</span>
              <button
                onClick={onClearHistory}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                履歴をクリア
              </button>
            </div>
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => selectFromHistory(item.query)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
                  {item.query}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.resultCount}件 • {item.timestamp.toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 🎛️ 検索オプションパネル */}
      {showOptions && (
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 📝 ファジー検索 */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={searchOptions.fuzzySearch}
                onChange={() => toggleOption('fuzzySearch')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">ファジー検索</span>
            </label>

            {/* 📝 正規表現 */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={searchOptions.useRegex}
                onChange={() => toggleOption('useRegex')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">正規表現</span>
            </label>

            {/* 📝 大文字小文字区別 */}
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={searchOptions.caseSensitive}
                onChange={() => toggleOption('caseSensitive')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">大文字小文字区別</span>
            </label>
          </div>

          {/* 📝 検索構文のヘルプ */}
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-xs text-blue-800 dark:text-blue-300 font-medium mb-1">
              高度な検索構文:
            </p>
            <div className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
              <div><code>&quot;完全一致&quot;</code> - 完全一致検索</div>
              <div><code>status:active</code> - ステータス検索</div>
              <div><code>created:&gt;2024-01-01</code> - 日付条件</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { exportTodos, importTodos, clearTodos } from '@/lib/localStorage';

interface DataManagementProps {
  todos: Todo[];
  onImport: (todos: Todo[]) => void;
  onClear: () => void;
}

export function DataManagement({ todos, onImport, onClear }: DataManagementProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // 📝 データをエクスポート（ダウンロード）
  const handleExport = () => {
    try {
      const jsonData = exportTodos(todos);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowMenu(false);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  // 📝 ファイルからデータをインポート
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTodos = importTodos(content);
        onImport(importedTodos);
        setImportError(null);
        setShowMenu(false);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'インポートに失敗しました');
      }
    };
    reader.readAsText(file);
    
    // 🔄 ファイル入力をリセット（同じファイルを再選択可能にする）
    event.target.value = '';
  };

  // 📝 データクリア（確認ダイアログ付き）
  const handleClear = () => {
    if (window.confirm('すべてのタスクデータを削除しますか？この操作は取り消せません。')) {
      clearTodos();
      onClear();
      setShowMenu(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 
                   border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                   transition-colors duration-200"
        aria-label="データ管理メニュー"
      >
        ⚙️ データ管理
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="p-4 space-y-3">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">データ管理</h3>
            
            {/* エクスポート */}
            <button
              onClick={handleExport}
              disabled={todos.length === 0}
              className="w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md
                         disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              📥 エクスポート ({todos.length}件)
            </button>

            {/* インポート */}
            <label className="block">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <span className="w-full inline-block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 
                              hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                📤 インポート
              </span>
            </label>

            {/* データクリア */}
            <button
              onClick={handleClear}
              disabled={todos.length === 0}
              className="w-full px-3 py-2 text-sm text-left text-red-600 dark:text-red-400 
                         hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md
                         disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              🗑️ すべてクリア
            </button>

            {/* エラーメッセージ */}
            {importError && (
              <div className="p-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md">
                {importError}
              </div>
            )}

            {/* 使用状況表示 */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                保存済み: {todos.length}件のタスク
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 📝 メニュー外クリックで閉じる */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
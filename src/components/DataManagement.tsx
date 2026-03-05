'use client';

import { useState } from 'react';
import { Todo } from '@/types/todo';
import { exportTodos, importTodos, clearTodos } from '@/lib/localStorage';

interface DataManagementProps {
  todos: Todo[];
  onTodosImported: (todos: Todo[]) => void;
  onDataCleared: () => void;
}

export function DataManagement({ todos, onTodosImported, onDataCleared }: DataManagementProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // 📝 データエクスポート機能
  const handleExport = () => {
    try {
      const data = exportTodos(todos);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('🚩 Failed to export todos:', error);
      alert('エクスポートに失敗しました。');
    }
  };

  // 📝 データインポート機能
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTodos = importTodos(content);
        if (importedTodos.length > 0) {
          onTodosImported(importedTodos);
          alert(`${importedTodos.length}件のタスクをインポートしました。`);
        } else {
          alert('有効なタスクデータが見つかりませんでした。');
        }
      } catch (error) {
        console.error('🚩 Failed to import todos:', error);
        alert('インポートに失敗しました。');
      }
    };
    reader.readAsText(file);
    
    // 📝 ファイル選択をリセット
    event.target.value = '';
  };

  // 📝 データクリア機能（確認ダイアログ付き）
  const handleClearData = () => {
    try {
      clearTodos();
      onDataCleared();
      setShowConfirmClear(false);
      alert('すべてのデータをクリアしました。');
    } catch (error) {
      console.error('🚩 Failed to clear todos:', error);
      alert('データクリアに失敗しました。');
    }
  };

  return (
    <div className="relative">
      {/* 📝 設定ボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="データ管理"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* 📝 設定メニュー */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 z-20 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-4 min-w-48">
            <div className="space-y-3">
              {/* 📝 エクスポートボタン */}
              <button
                onClick={handleExport}
                disabled={todos.length === 0}
                className="w-full px-3 py-2 text-sm text-left bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                📤 データをエクスポート
              </button>

              {/* 📝 インポートボタン */}
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <span className="block w-full px-3 py-2 text-sm text-left bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer transition-colors">
                  📥 データをインポート
                </span>
              </label>

              {/* 📝 データクリアボタン */}
              <button
                onClick={() => setShowConfirmClear(true)}
                disabled={todos.length === 0}
                className="w-full px-3 py-2 text-sm text-left bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                🗑️ データをクリア
              </button>

              {/* 📝 データ使用状況表示 */}
              <div className="pt-2 border-t dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                保存済み: {todos.length}件のタスク
              </div>
            </div>
          </div>
        </>
      )}

      {/* 📝 データクリア確認ダイアログ */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              データクリアの確認
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              すべてのタスクデータが削除されます。この操作は元に戻せません。本当に実行しますか？
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
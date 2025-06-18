'use client';

// 📝 テーマ設定コンポーネント
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeSettings() {
  const { currentTheme, availableThemes, settings, setTheme, updateSettings } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* 📝 テーマ切り替えボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors duration-200
                   bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-gray-700 dark:text-gray-300"
        aria-label="テーマ設定を開く"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {/* 📝 テーマ設定パネル */}
      {isOpen && (
        <>
          {/* 📝 オーバーレイ */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 📝 設定パネル */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                テーマ設定
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* 📝 テーマ選択グリッド */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                テーマを選択
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {availableThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`p-3 rounded-lg border-2 transition-all duration-200 text-left
                      ${currentTheme.id === theme.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {theme.name}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.colors.background }}
                      />
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.colors.surface }}
                      />
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 📝 フォントサイズ設定 */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                フォントサイズ
              </h4>
              <div className="flex space-x-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`px-3 py-2 rounded-md text-sm transition-colors duration-200
                      ${settings.fontSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                  >
                    {size === 'small' && '小'}
                    {size === 'medium' && '中'}
                    {size === 'large' && '大'}
                  </button>
                ))}
              </div>
            </div>

            {/* 📝 アクセシビリティ設定 */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                アクセシビリティ
              </h4>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.reduceMotion}
                  onChange={(e) => updateSettings({ reduceMotion: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  アニメーションを削減
                </span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSettings({ highContrast: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  ハイコントラスト
                </span>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
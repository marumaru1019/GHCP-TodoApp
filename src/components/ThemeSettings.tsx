'use client';

// 📝 テーマ設定コンポーネント
import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { ThemeColors } from '@/types/theme';

export function ThemeSettings() {
  const { currentTheme, availableThemes, settings, setTheme, updateSettings, createCustomTheme, deleteCustomTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColors, setCustomColors] = useState<ThemeColors>(currentTheme.colors);
  const [customThemeName, setCustomThemeName] = useState('');

  // 📝 カラー更新ヘルパー関数
  const updateColor = (key: string, value: string) => {
    const newColors = { ...customColors };
    if (key.startsWith('text-')) {
      const textKey = key.split('-')[1] as keyof typeof customColors.text;
      newColors.text = { ...newColors.text, [textKey]: value };
    } else {
      // 📝 型安全な方法でカラーを更新
      switch (key) {
        case 'primary':
          newColors.primary = value;
          break;
        case 'secondary':
          newColors.secondary = value;
          break;
        case 'background':
          newColors.background = value;
          break;
        case 'surface':
          newColors.surface = value;
          break;
        case 'accent':
          newColors.accent = value;
          break;
        case 'success':
          newColors.success = value;
          break;
        case 'warning':
          newColors.warning = value;
          break;
        case 'error':
          newColors.error = value;
          break;
        case 'border':
          newColors.border = value;
          break;
      }
    }
    setCustomColors(newColors);
  };

  const handleCreateCustomTheme = () => {
    // 📝 現在のテーマをベースにカスタムテーマを作成
    setCustomColors(currentTheme.colors);
    setCustomThemeName(`${currentTheme.name}のコピー`);
    setShowColorPicker(true);
  };

  const handleSaveCustomTheme = () => {
    if (customThemeName.trim()) {
      createCustomTheme({
        name: customThemeName.trim(),
        colors: customColors,
        isDark: currentTheme.isDark, // 📝 現在のテーマのダーク設定を継承
      });
      setShowColorPicker(false);
      setCustomThemeName('');
    }
  };

  const handleDeleteTheme = (themeId: string) => {
    if (confirm('このカスタムテーマを削除しますか？')) {
      deleteCustomTheme(themeId);
    }
  };

  return (
    <>
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
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    テーマを選択
                  </h4>
                  <button
                    onClick={handleCreateCustomTheme}
                    className="text-xs px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                  >
                    + カスタム
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {availableThemes.map((theme) => (
                    <div key={theme.id} className="relative">
                      <button
                        onClick={() => setTheme(theme.id)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left
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
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
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
                      
                      {/* 📝 カスタムテーマの削除ボタン */}
                      {theme.id.startsWith('custom-') && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTheme(theme.id);
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      )}
                    </div>
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

      {/* 📝 カラーピッカーモーダル */}
      {showColorPicker && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    カスタムテーマを作成
                  </h3>
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
                
                {/* 📝 テーマ名入力 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    テーマ名
                  </label>
                  <input
                    type="text"
                    value={customThemeName}
                    onChange={(e) => setCustomThemeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="カスタムテーマ名を入力"
                  />
                </div>

                {/* 📝 カラーピッカー（インライン） */}
                <div className="space-y-6">
                  {/* 📝 プレビューエリア */}
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      プレビュー
                    </h4>
                    <div 
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: customColors.background,
                        color: customColors.text.primary,
                        border: `1px solid ${customColors.border}`
                      }}
                    >
                      <div 
                        className="inline-block px-3 py-1 rounded text-white text-sm mb-2"
                        style={{ backgroundColor: customColors.primary }}
                      >
                        プライマリボタン
                      </div>
                      <div 
                        className="p-3 rounded mb-2"
                        style={{ backgroundColor: customColors.surface }}
                      >
                        <p style={{ color: customColors.text.primary }}>メインテキスト</p>
                        <p style={{ color: customColors.text.secondary }}>セカンダリテキスト</p>
                      </div>
                      <div className="flex space-x-2">
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customColors.accent }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customColors.success }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customColors.warning }}
                        />
                        <div 
                          className="w-8 h-8 rounded"
                          style={{ backgroundColor: customColors.error }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 📝 カラー設定 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'primary', label: 'プライマリ' },
                      { key: 'secondary', label: 'セカンダリ' },
                      { key: 'background', label: '背景' },
                      { key: 'surface', label: 'サーフェス' },
                      { key: 'text-primary', label: 'メインテキスト' },
                      { key: 'text-secondary', label: 'サブテキスト' },
                      { key: 'accent', label: 'アクセント' },
                      { key: 'success', label: '成功' },
                      { key: 'warning', label: '警告' },
                      { key: 'error', label: 'エラー' },
                      { key: 'border', label: 'ボーダー' },
                    ].map(({ key, label }) => {
                      const value = key.startsWith('text-') 
                        ? customColors.text[key.split('-')[1] as keyof typeof customColors.text]
                        : customColors[key as keyof typeof customColors] as string;
                      
                      return (
                        <div key={key} className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="color"
                              value={value}
                              onChange={(e) => updateColor(key, e.target.value)}
                              className="w-10 h-8 rounded border border-gray-300 dark:border-gray-600"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => updateColor(key, e.target.value)}
                              className="flex-1 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 📝 アクションボタン */}
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowColorPicker(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleSaveCustomTheme}
                      disabled={!customThemeName.trim()}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg"
                    >
                      テーマを保存
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
'use client';

import { useState } from 'react';
import { TodoCategory, TodoTag } from '@/types/todo';

interface TodoInputProps {
  onAddTodo: (text: string, category?: TodoCategory, tags?: TodoTag[]) => void;
  categories: TodoCategory[];
  tags: TodoTag[];
}

export function TodoInput({ onAddTodo, categories, tags }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TodoCategory | undefined>();
  const [selectedTags, setSelectedTags] = useState<TodoTag[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue, selectedCategory, selectedTags);
      setInputValue('');
      setSelectedCategory(undefined);
      setSelectedTags([]);
      setTagInput('');
    }
  };

  // 📝 タグの追加/削除処理
  const toggleTag = (tag: TodoTag) => {
    setSelectedTags(prev => 
      prev.find(t => t.id === tag.id)
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  // 📝 新規タグの作成
  const createNewTag = (name: string) => {
    const newTag: TodoTag = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: '#6B7280' // デフォルトのグレー色
    };
    return newTag;
  };

  // 📝 タグ入力のEnterキー処理
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagInput.trim()) {
        const existingTag = tags.find(tag => tag.name.toLowerCase() === tagInput.trim().toLowerCase());
        if (existingTag) {
          toggleTag(existingTag);
        } else {
          const newTag = createNewTag(tagInput);
          setSelectedTags(prev => [...prev, newTag]);
        }
        setTagInput('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 📝 メインの入力フィールド */}
      <div className="flex gap-2">
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
      </div>

      {/* 📝 カテゴリ選択とタグ入力 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 📝 カテゴリ選択ドロップダウン */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            カテゴリ
          </label>
          <select
            value={selectedCategory?.id || ''}
            onChange={(e) => {
              const category = categories.find(c => c.id === e.target.value);
              setSelectedCategory(category);
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent"
          >
            <option value="">カテゴリを選択</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 📝 タグ入力 */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            タグ
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="タグを入力してEnter..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-[#ff0033] focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* 📝 選択されたカテゴリの表示 */}
      {selectedCategory && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">選択中のカテゴリ:</span>
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: selectedCategory.color }}
          >
            {selectedCategory.icon} {selectedCategory.name}
          </span>
        </div>
      )}

      {/* 📝 選択されたタグの表示 */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">選択中のタグ:</span>
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-white cursor-pointer"
              style={{ backgroundColor: tag.color }}
              onClick={() => toggleTag(tag)}
            >
              {tag.name} ×
            </span>
          ))}
        </div>
      )}

      {/* 📝 利用可能なタグの表示 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">よく使うタグ:</span>
          {tags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium transition-opacity
                         ${selectedTags.find(t => t.id === tag.id) ? 'opacity-50' : 'hover:opacity-80'}
                         text-white`}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

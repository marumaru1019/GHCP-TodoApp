'use client';

import { TodoCategory, TodoTag } from '@/types/todo';

interface CategoryTagFilterProps {
  categories: TodoCategory[];
  tags: TodoTag[];
  selectedCategories: string[];
  selectedTags: string[];
  onCategoryFilterChange: (categoryIds: string[]) => void;
  onTagFilterChange: (tagIds: string[]) => void;
}

export function CategoryTagFilter({
  categories,
  tags,
  selectedCategories,
  selectedTags,
  onCategoryFilterChange,
  onTagFilterChange,
}: CategoryTagFilterProps) {
  // 📝 カテゴリフィルタの切り替え
  const toggleCategory = (categoryId: string) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    onCategoryFilterChange(newSelection);
  };

  // 📝 タグフィルタの切り替え
  const toggleTag = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagFilterChange(newSelection);
  };

  // 📝 フィルタのクリア
  const clearFilters = () => {
    onCategoryFilterChange([]);
    onTagFilterChange([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* 📝 フィルタヘッダー */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          カテゴリ・タグフィルタ
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#ff0033] dark:text-[#ff4d6e] hover:underline"
          >
            クリア
          </button>
        )}
      </div>

      {/* 📝 カテゴリフィルタ */}
      <div>
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          カテゴリ
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium
                         transition-all duration-200
                         ${selectedCategories.includes(category.id)
                           ? 'text-white shadow-md'
                           : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                         }`}
              style={selectedCategories.includes(category.id) 
                ? { backgroundColor: category.color }
                : {}
              }
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 📝 タグフィルタ */}
      <div>
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          タグ
        </h4>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium
                         transition-all duration-200
                         ${selectedTags.includes(tag.id)
                           ? 'text-white shadow-md'
                           : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                         }`}
              style={selectedTags.includes(tag.id) 
                ? { backgroundColor: tag.color }
                : {}
              }
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* 📝 アクティブフィルタの表示 */}
      {hasActiveFilters && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {selectedCategories.length > 0 && (
            <span>カテゴリ: {selectedCategories.length}個 </span>
          )}
          {selectedTags.length > 0 && (
            <span>タグ: {selectedTags.length}個</span>
          )}
        </div>
      )}
    </div>
  );
}
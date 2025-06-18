import { useState, useMemo } from 'react';
import { Todo } from '@/types/todo';
import { fuzzySearch, highlightMatches, parseSearchQuery, compareDates } from '@/utils/searchUtils';

// 📝 検索オプションの定義
export interface SearchOptions {
  query: string;
  caseSensitive: boolean;
  useRegex: boolean;
  fuzzySearch: boolean;
  searchFields: ('text' | 'description' | 'category' | 'tags')[];
}

// 📝 フィルターオプションの定義
export interface FilterOptions {
  status: 'all' | 'active' | 'completed';
  categories: string[];
  tags: string[];
  priority: ('high' | 'medium' | 'low')[];
  dateRange: {
    start?: Date;
    end?: Date;
    type: 'created' | 'updated' | 'due';
  };
}

// 📝 検索結果の定義
export interface SearchResult {
  todo: Todo;
  score: number;
  highlightedText: string;
}

// 📝 検索履歴の定義
export interface SearchHistory {
  query: string;
  timestamp: Date;
  resultCount: number;
}

/**
 * 🔍 高度な検索機能を提供するカスタムフック
 */
export const useSearch = () => {
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    query: '',
    caseSensitive: false,
    useRegex: false,
    fuzzySearch: true,
    searchFields: ['text'],
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    categories: [],
    tags: [],
    priority: [],
    dateRange: {
      type: 'created',
    },
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  /**
   * 📝 Todoリストの検索・フィルタリングを実行
   */
  const searchTodos = useMemo(() => {
    return (todos: Todo[]): SearchResult[] => {
      if (!searchOptions.query && filterOptions.status === 'all' && 
          filterOptions.categories.length === 0 && filterOptions.tags.length === 0) {
        // 🚩 検索条件が空の場合は全て返す
        return todos.map(todo => ({
          todo,
          score: 1,
          highlightedText: todo.text,
        }));
      }

      const results: SearchResult[] = [];

      // 📝 検索クエリのパース
      const parsedQuery = parseSearchQuery(searchOptions.query);

      // 🎯 各Todoに対して検索・フィルタリングを実行
      for (const todo of todos) {
        const matches = true;
        let score = 0;

        // 📝 ステータスフィルタ
        if (filterOptions.status !== 'all') {
          if (filterOptions.status === 'active' && todo.completed) continue;
          if (filterOptions.status === 'completed' && !todo.completed) continue;
        }

        // 🎯 日付範囲フィルタ（早期に実行）
        if (filterOptions.dateRange.start || filterOptions.dateRange.end) {
          let dateInRange = true;
          const targetDate = todo.createdAt; // 将来的にはtypeに応じて変更

          if (filterOptions.dateRange.start) {
            dateInRange = dateInRange && targetDate >= filterOptions.dateRange.start;
          }
          if (filterOptions.dateRange.end) {
            dateInRange = dateInRange && targetDate <= filterOptions.dateRange.end;
          }

          if (!dateInRange) continue;
        }

        // 📝 パースされたクエリによるフィルタリング
        if (parsedQuery.status.length > 0) {
          const todoStatus = todo.completed ? 'completed' : 'active';
          if (!parsedQuery.status.includes(todoStatus)) continue;
        }

        // 📝 日付条件のチェック
        if (parsedQuery.dateConditions.length > 0) {
          let dateMatches = false;
          for (const condition of parsedQuery.dateConditions) {
            if (condition.type === 'created') {
              dateMatches = compareDates(todo.createdAt, condition.operator, condition.date);
              if (dateMatches) break;
            }
            // 🚩 将来の拡張: updated, due date
          }
          if (!dateMatches) continue;
        }

        // 📝 テキスト検索
        if (parsedQuery.text) {
          const searchText = parsedQuery.text;
          let textScore = 0;

          if (parsedQuery.exactMatch) {
            // 🎯 完全一致検索
            const text = searchOptions.caseSensitive ? todo.text : todo.text.toLowerCase();
            const query = searchOptions.caseSensitive ? searchText : searchText.toLowerCase();
            if (text.includes(query)) {
              textScore = 1;
            }
          } else if (searchOptions.useRegex) {
            // 📝 正規表現検索
            try {
              const flags = searchOptions.caseSensitive ? 'g' : 'gi';
              const regex = new RegExp(searchText, flags);
              if (regex.test(todo.text)) {
                textScore = 0.8;
              }
            } catch {
              // 🐞 正規表現エラーの場合は通常検索にフォールバック
              textScore = todo.text.toLowerCase().includes(searchText.toLowerCase()) ? 0.6 : 0;
            }
          } else if (searchOptions.fuzzySearch) {
            // 🔍 ファジー検索
            textScore = fuzzySearch(searchText, todo.text);
          } else {
            // 📝 通常の部分一致検索
            const text = searchOptions.caseSensitive ? todo.text : todo.text.toLowerCase();
            const query = searchOptions.caseSensitive ? searchText : searchText.toLowerCase();
            textScore = text.includes(query) ? 0.7 : 0;
          }

          if (textScore === 0) continue;
          score += textScore;
        } else {
          // 📝 テキスト検索がない場合はデフォルトスコア
          score = 1;
        }

        if (matches && score > 0) {
          results.push({
            todo,
            score,
            highlightedText: highlightMatches(todo.text, parsedQuery.text || searchOptions.query),
          });
        }
      }

      // 📝 スコア順でソート
      results.sort((a, b) => b.score - a.score);

      // 🔍 検索履歴に追加
      if (searchOptions.query) {
        addToHistory(searchOptions.query, results.length);
      }

      return results;
    };
  }, [searchOptions, filterOptions]);

  /**
   * 📝 検索履歴に追加
   */
  const addToHistory = (query: string, resultCount: number) => {
    setSearchHistory(prev => {
      const newEntry: SearchHistory = {
        query,
        timestamp: new Date(),
        resultCount,
      };
      
      // 🚩 重複を除去し、最新の10件のみ保持
      const filtered = prev.filter(item => item.query !== query);
      return [newEntry, ...filtered].slice(0, 10);
    });
  };

  /**
   * 📝 検索条件をクリア
   */
  const clearSearch = () => {
    setSearchOptions(prev => ({
      ...prev,
      query: '',
    }));
    setFilterOptions({
      status: 'all',
      categories: [],
      tags: [],
      priority: [],
      dateRange: {
        type: 'created',
      },
    });
  };

  /**
   * 📝 検索履歴をクリア
   */
  const clearHistory = () => {
    setSearchHistory([]);
  };

  return {
    searchOptions,
    setSearchOptions,
    filterOptions,
    setFilterOptions,
    searchTodos,
    searchHistory,
    clearSearch,
    clearHistory,
    addToHistory,
  };
};
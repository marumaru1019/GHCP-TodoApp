import { TodoCategory, TodoTag } from '@/types/todo';

// 📝 デフォルトカテゴリの定義 - 問題文の要件通り
export const defaultCategories: TodoCategory[] = [
  { id: '1', name: '仕事', color: '#3B82F6', icon: '💼' },
  { id: '2', name: 'プライベート', color: '#10B981', icon: '🏠' },
  { id: '3', name: '学習', color: '#8B5CF6', icon: '📚' },
  { id: '4', name: '買い物', color: '#F59E0B', icon: '🛒' },
  { id: '5', name: 'その他', color: '#6B7280', icon: '📝' }
];

// 📝 サンプルタグの定義
export const defaultTags: TodoTag[] = [
  { id: '1', name: '緊急', color: '#EF4444' },
  { id: '2', name: '長期', color: '#6B7280' },
  { id: '3', name: 'アイデア', color: '#EC4899' },
  { id: '4', name: '重要', color: '#F59E0B' },
  { id: '5', name: '簡単', color: '#10B981' }
];
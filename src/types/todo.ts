// 📝 優先度の型定義を追加
export type TodoPriority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: TodoPriority; // 📝 優先度フィールドを追加
}

export type TodoFilter = 'all' | 'active' | 'completed';

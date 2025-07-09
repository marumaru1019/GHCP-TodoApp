// 📝 優先度の型定義 - 高、中、低の3段階
export type TodoPriority = 'high' | 'medium' | 'low';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  priority: TodoPriority; // 📝 優先度フィールドを追加
}

export type TodoFilter = 'all' | 'active' | 'completed';

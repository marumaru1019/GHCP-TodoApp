// 📝 カテゴリ情報を管理するインターフェース
export interface TodoCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// 📝 タグ情報を管理するインターフェース
export interface TodoTag {
  id: string;
  name: string;
  color: string;
}

// 📝 拡張されたTodoインターフェース - カテゴリとタグを追加
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  category?: TodoCategory; // 📝 オプションのカテゴリ
  tags: TodoTag[]; // 📝 タグの配列
}

// 📝 フィルタ機能を拡張 - カテゴリやタグでのフィルタリングも対応予定
export type TodoFilter = 'all' | 'active' | 'completed';

import { Todo } from '@/types/todo';

// 📝 ローカルストレージのキー定数
export const STORAGE_KEY = 'todoApp_tasks';

/**
 * 📝 Todoリストをローカルストレージに保存する
 * @param todos - 保存するTodoの配列
 */
export const saveTodos = (todos: Todo[]): void => {
  try {
    // 🔄 DateオブジェクトをISO文字列に変換してからJSON化
    const serializedTodos = todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString()
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedTodos));
  } catch (error) {
    // 🚩 ローカルストレージの容量制限やその他のエラーをキャッチ
    console.error('Failed to save todos to localStorage:', error);
  }
};

/**
 * 📝 ローカルストレージからTodoリストを読み込む
 * @returns Todo配列（エラー時は空配列）
 */
export const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // 🔄 ISO文字列をDateオブジェクトに復元
      return parsed.map((todo: {
        id: string;
        text: string;
        completed: boolean;
        createdAt: string;
      }) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
  } catch (error) {
    // 🚩 JSONパースエラーや不正なデータ形式をキャッチ
    console.error('Failed to load todos from localStorage:', error);
  }
  return [];
};

/**
 * 📝 ローカルストレージからTodoデータをクリアする
 */
export const clearTodos = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear todos from localStorage:', error);
  }
};

/**
 * 📝 TodoデータをJSON形式でエクスポートする
 * @param todos - エクスポートするTodoの配列
 * @returns JSON文字列
 */
export const exportTodos = (todos: Todo[]): string => {
  try {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      todos: todos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString()
      }))
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export todos:', error);
    throw new Error('エクスポートに失敗しました');
  }
};

/**
 * 📝 JSON形式のデータからTodoリストをインポートする
 * @param jsonData - インポートするJSON文字列
 * @returns Todo配列
 */
export const importTodos = (jsonData: string): Todo[] => {
  try {
    const parsed = JSON.parse(jsonData);
    
    // 🔍 データ形式の検証
    if (!parsed.todos || !Array.isArray(parsed.todos)) {
      throw new Error('Invalid data format: todos array not found');
    }
    
    // 🔄 各Todoアイテムの形式を検証しつつ変換
    return parsed.todos.map((todo: {
      id?: string;
      text?: string;
      completed?: boolean;
      createdAt?: string;
    }, index: number) => {
      if (!todo.id || typeof todo.text !== 'string' || typeof todo.completed !== 'boolean') {
        throw new Error(`Invalid todo format at index ${index}`);
      }
      
      return {
        id: todo.id,
        text: todo.text,
        completed: todo.completed,
        createdAt: new Date(todo.createdAt || new Date().toISOString())
      };
    });
  } catch (error) {
    console.error('Failed to import todos:', error);
    throw new Error('インポートに失敗しました。正しいファイル形式か確認してください。');
  }
};
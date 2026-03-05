import { Todo } from '@/types/todo';

// 📝 ローカルストレージのキー定数
export const STORAGE_KEY = 'todoApp_tasks';

/**
 * 📝 Todoリストをローカルストレージに保存する
 * @param todos - 保存するTodoの配列
 */
export const saveTodos = (todos: Todo[]): void => {
  try {
    const serializedTodos = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, serializedTodos);
  } catch (error) {
    console.error('🚩 Failed to save todos to localStorage:', error);
    // 🔥 ローカルストレージが利用できない場合（プライベートブラウジングなど）でもアプリを継続動作
  }
};

/**
 * 📝 ローカルストレージからTodoリストを読み込む
 * @returns 読み込んだTodoの配列、エラー時は空配列
 */
export const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    
    // 📝 データの妥当性チェックと日付オブジェクトの復元
    if (Array.isArray(parsed)) {
      return parsed.map((todo: unknown) => {
        // 📝 型安全性を確保するためのガード
        if (typeof todo === 'object' && todo !== null && 'createdAt' in todo) {
          return {
            ...todo as Todo,
            createdAt: new Date((todo as Todo).createdAt)
          };
        }
        return todo as Todo;
      });
    }
    
    return [];
  } catch (error) {
    console.error('🚩 Failed to load todos from localStorage:', error);
    return [];
  }
};

/**
 * 📝 ローカルストレージからTodoデータをクリアする
 */
export const clearTodos = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('🚩 Failed to clear todos from localStorage:', error);
  }
};

/**
 * 📝 TodoデータをJSON形式でエクスポートする
 * @param todos - エクスポートするTodoの配列
 * @returns JSON文字列
 */
export const exportTodos = (todos: Todo[]): string => {
  return JSON.stringify(todos, null, 2);
};

/**
 * 📝 JSON文字列からTodoデータをインポートする
 * @param jsonString - インポートするJSON文字列
 * @returns パースされたTodoの配列、エラー時は空配列
 */
export const importTodos = (jsonString: string): Todo[] => {
  try {
    const parsed = JSON.parse(jsonString);
    
    if (Array.isArray(parsed)) {
      // 📝 データの妥当性チェックと必須フィールドの確認
      return parsed
        .filter((item: unknown) => {
          if (typeof item !== 'object' || item === null) return false;
          const todo = item as Record<string, unknown>;
          return (
            typeof todo.id === 'string' && 
            typeof todo.text === 'string' && 
            typeof todo.completed === 'boolean'
          );
        })
        .map((todo: unknown) => {
          const todoItem = todo as Record<string, unknown>;
          return {
            ...todoItem as Todo,
            createdAt: todoItem.createdAt ? new Date(todoItem.createdAt as string) : new Date()
          };
        });
    }
    
    return [];
  } catch (error) {
    console.error('🚩 Failed to import todos from JSON:', error);
    return [];
  }
};

/**
 * 📝 ローカルストレージが利用可能かチェックする
 * @returns ローカルストレージが利用可能かどうか
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
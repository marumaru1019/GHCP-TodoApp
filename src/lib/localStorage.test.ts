import { Todo } from '@/types/todo';
import { saveTodos, loadTodos, clearTodos, exportTodos, importTodos } from './localStorage';

// 📝 localStorage のモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('localStorage utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  const sampleTodos: Todo[] = [
    {
      id: '1',
      text: 'テストタスク1',
      completed: false,
      createdAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      text: 'テストタスク2',
      completed: true,
      createdAt: new Date('2024-01-02T11:00:00Z'),
    },
  ];

  describe('saveTodos and loadTodos', () => {
    it('Todoデータを保存して読み込める', () => {
      saveTodos(sampleTodos);
      const loadedTodos = loadTodos();
      
      expect(loadedTodos).toHaveLength(2);
      expect(loadedTodos[0].text).toBe('テストタスク1');
      expect(loadedTodos[0].completed).toBe(false);
      expect(loadedTodos[0].createdAt).toEqual(new Date('2024-01-01T10:00:00Z'));
      expect(loadedTodos[1].text).toBe('テストタスク2');
      expect(loadedTodos[1].completed).toBe(true);
    });

    it('空のデータを保存して読み込める', () => {
      saveTodos([]);
      const loadedTodos = loadTodos();
      expect(loadedTodos).toHaveLength(0);
    });

    it('データが存在しない場合は空配列を返す', () => {
      const loadedTodos = loadTodos();
      expect(loadedTodos).toHaveLength(0);
    });
  });

  describe('clearTodos', () => {
    it('Todoデータをクリアできる', () => {
      saveTodos(sampleTodos);
      clearTodos();
      const loadedTodos = loadTodos();
      expect(loadedTodos).toHaveLength(0);
    });
  });

  describe('exportTodos', () => {
    it('TodoデータをJSON形式でエクスポートできる', () => {
      const jsonString = exportTodos(sampleTodos);
      const parsed = JSON.parse(jsonString);
      
      expect(parsed.version).toBe('1.0');
      expect(parsed.exportDate).toBeDefined();
      expect(parsed.todos).toHaveLength(2);
      expect(parsed.todos[0].text).toBe('テストタスク1');
    });
  });

  describe('importTodos', () => {
    it('JSON形式のデータからTodoリストをインポートできる', () => {
      const exportedData = exportTodos(sampleTodos);
      const importedTodos = importTodos(exportedData);
      
      expect(importedTodos).toHaveLength(2);
      expect(importedTodos[0].text).toBe('テストタスク1');
      expect(importedTodos[0].completed).toBe(false);
      expect(importedTodos[1].text).toBe('テストタスク2');
      expect(importedTodos[1].completed).toBe(true);
    });

    it('不正なデータ形式の場合はエラーを投げる', () => {
      expect(() => importTodos('invalid json')).toThrow('インポートに失敗しました');
      expect(() => importTodos('{"invalid": "format"}')).toThrow('インポートに失敗しました');
    });
  });
});
import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { saveTodos, loadTodos } from './localStorage';

/**
 * 📝 ローカルストレージと同期するカスタムフック
 * Todoデータの状態管理と自動永続化を行う
 */
export const usePersistentTodos = () => {
  // 📝 初期値としてローカルストレージからデータを読み込む
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== 'undefined') {
      return loadTodos();
    }
    return [];
  });

  // 📝 todosが変更されるたびにローカルストレージに保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveTodos(todos);
    }
  }, [todos]);

  return [todos, setTodos] as const;
};
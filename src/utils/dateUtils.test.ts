import { formatDueDate, getDueDateStatus, isTaskOverdue, sortTodosByDueDate } from './dateUtils';
import { Todo } from '@/types/todo';

describe('Date Utilities', () => {
  const mockTodo = (id: string, dueDate?: Date): Todo => ({
    id,
    text: `Task ${id}`,
    completed: false,
    createdAt: new Date(),
    dueDate,
  });

  describe('formatDueDate', () => {
    it('今日の日付の場合「今日まで」を返す', () => {
      const today = new Date();
      expect(formatDueDate(today)).toBe('今日まで');
    });

    it('明日の日付の場合「明日まで」を返す', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(formatDueDate(tomorrow)).toBe('明日まで');
    });

    it('その他の日付の場合「〇月〇日まで」を返す', () => {
      const futureDate = new Date('2024-06-15');
      expect(formatDueDate(futureDate)).toBe('6月15日まで');
    });
  });

  describe('getDueDateStatus', () => {
    it('期限切れの場合「overdue」を返す', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(getDueDateStatus(pastDate)).toBe('overdue');
    });

    it('今日または明日の場合「urgent」を返す', () => {
      const today = new Date();
      expect(getDueDateStatus(today)).toBe('urgent');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(getDueDateStatus(tomorrow)).toBe('urgent');
    });

    it('3日以内の場合「soon」を返す', () => {
      const threeDaysLater = new Date();
      threeDaysLater.setDate(threeDaysLater.getDate() + 3);
      expect(getDueDateStatus(threeDaysLater)).toBe('soon');
    });

    it('3日より先の場合「normal」を返す', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      expect(getDueDateStatus(futureDate)).toBe('normal');
    });
  });

  describe('isTaskOverdue', () => {
    it('期限切れのタスクに対してtrueを返す', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const todo = mockTodo('1', pastDate);
      expect(isTaskOverdue(todo)).toBe(true);
    });

    it('期限内のタスクに対してfalseを返す', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      const todo = mockTodo('1', futureDate);
      expect(isTaskOverdue(todo)).toBe(false);
    });

    it('期限なしのタスクに対してfalseを返す', () => {
      const todo = mockTodo('1');
      expect(isTaskOverdue(todo)).toBe(false);
    });
  });

  describe('sortTodosByDueDate', () => {
    it('期限が早い順にソートする', () => {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(today.getDate() + 2);

      const todos = [
        mockTodo('3', dayAfterTomorrow),
        mockTodo('1', today),
        mockTodo('2', tomorrow),
      ];

      const sorted = sortTodosByDueDate(todos);
      expect(sorted.map(t => t.id)).toEqual(['1', '2', '3']);
    });

    it('期限なしのタスクは最後に配置する', () => {
      const today = new Date();
      const todos = [
        mockTodo('2'),
        mockTodo('1', today),
        mockTodo('3'),
      ];

      const sorted = sortTodosByDueDate(todos);
      expect(sorted.map(t => t.id)).toEqual(['1', '2', '3']);
    });
  });
});
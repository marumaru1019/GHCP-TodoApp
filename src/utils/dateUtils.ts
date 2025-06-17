import { Todo } from '@/types/todo';

// 📝 Date utility functions for task deadline management

export type DueDateStatus = 'overdue' | 'urgent' | 'soon' | 'normal';

/**
 * Format due date for display
 */
export const formatDueDate = (dueDate: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // 🚩 Reset time to midnight for date comparison
  const dueDateMidnight = new Date(dueDate);
  dueDateMidnight.setHours(0, 0, 0, 0);
  
  const todayMidnight = new Date(today);
  todayMidnight.setHours(0, 0, 0, 0);
  
  const tomorrowMidnight = new Date(tomorrow);
  tomorrowMidnight.setHours(0, 0, 0, 0);
  
  if (dueDateMidnight.getTime() === todayMidnight.getTime()) {
    return '今日まで';
  } else if (dueDateMidnight.getTime() === tomorrowMidnight.getTime()) {
    return '明日まで';
  } else {
    return `${dueDate.getMonth() + 1}月${dueDate.getDate()}日まで`;
  }
};

/**
 * Determine due date status for color coding
 */
export const getDueDateStatus = (dueDate: Date): DueDateStatus => {
  const now = new Date();
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) return 'overdue';
  if (daysDiff <= 1) return 'urgent';
  if (daysDiff <= 3) return 'soon';
  return 'normal';
};

/**
 * Check if a task is overdue
 */
export const isTaskOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate) return false;
  return new Date() > todo.dueDate;
};

/**
 * Get CSS classes for due date status
 */
export const getDueDateClasses = (status: DueDateStatus): string => {
  switch (status) {
    case 'overdue':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
    case 'urgent':
      return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
    case 'soon':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800';
  }
};

/**
 * Sort todos by due date (earliest first, undefined dates last)
 */
export const sortTodosByDueDate = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
};
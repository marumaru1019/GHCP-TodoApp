export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date; // 📝 Optional due date for task deadlines
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'overdue' | 'today' | 'no-due-date';

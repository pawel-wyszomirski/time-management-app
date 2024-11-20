export type Category = 'A' | 'B' | 'C';
export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime?: Date;
  pausedAt?: Date;
  totalPausedTime: number; // in milliseconds
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  projectId?: string;
  category: Category;
  date?: Date;
  duration?: number;
  notes?: string;
  timeBlockId?: string;
  order?: number;
}

export interface Project {
  id: string;
  name: string;
  category: Category;
  notes?: string;
}

export interface TimeBlock {
  id: string;
  weekDay: WeekDay;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  category: Category;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  createdAt: Date;
  dueDate?: Date;
  labels?: string[];
}

export type TaskStatus = "todo" | "inProgress" | "done";

export type TaskPriority = "low" | "medium" | "high";

export interface TaskColumn {
  id: string;
  title: string;
  tasks: Task[];
}

export interface TaskBoard {
  id: string;
  title: string;
  columns: TaskColumn[];
}

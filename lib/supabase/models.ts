// export interface Board {
//   id: string;
//   title: string;
//   description: string | null;
//   color: string;
//   user_id: string;
//   created_at: string;
//   updated_at: string;
// }
// export interface Column {
//   id: string;
//   board_id: string;
//   title: string;
//   sort_order: number;
//   created_at: string;
//   user_id: string;
// }

// export type ColumnWithTasks = Column & {
//   tasks: Task[];
// };

// export interface Task {
//   id: string;
//   column_id: string;
//   title: string;
//   description: string | null;
//   assignee: string | null;
//   due_date: string | null;
//   priority: "low" | "medium" | "high";
//   sort_order: number;
//   user_id: string;
//   created_at: string;
// }

export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Column {
  id: string;
  board_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  user_id: string;
}

export type ColumnWithTasks = Column & {
  tasks: Task[];
};

export interface Task {
  id: string;
  column_id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  sort_order: number;
  created_at: string;
}

// Comment interface - for task comments
export interface Comment {
  id: string;
  content: string; // comment content
  task_id: string; // ID of the task this comment belongs to
  user_id: string; // ID of the user who wrote the comment
  user_name: string | null; // user display name
  created_at: string; // creation timestamp
}

// Task with comments
export type TaskWithComments = Task & {
  comments: Comment[];
};

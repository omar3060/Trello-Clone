# Trello Clone - Complete Documentation

A modern, full-stack Trello clone built with Next.js 14, Supabase, and Clerk authentication. Features drag-and-drop task management, real-time updates, and a beautiful responsive UI.

![Project Architecture](https://img.shields.io/badge/Next.js-14-black)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
5. [Database Schema](#-database-schema)
6. [Architecture Explained](#-architecture-explained)
7. [File-by-File Explanation](#-file-by-file-explanation)
8. [How to Add New Features](#-how-to-add-new-features)
9. [Real Example: Adding Task Edit Feature](#-real-example-adding-task-edit-feature)
10. [Best Practices](#-best-practices)

---

## 🎯 Project Overview

This is a **Kanban board application** (like Trello) that allows users to:

- ✅ Create multiple boards
- ✅ Add columns to boards (To Do, In Progress, Done, etc.)
- ✅ Create tasks with title, description, assignee, priority, and due date
- ✅ Drag and drop tasks between columns
- ✅ Edit boards, columns, and tasks
- ✅ User authentication with Clerk

---

## 🛠 Tech Stack

| Technology       | Purpose                         |
| ---------------- | ------------------------------- |
| **Next.js 14**   | React framework with App Router |
| **TypeScript**   | Type-safe JavaScript            |
| **Supabase**     | PostgreSQL database + Real-time |
| **Clerk**        | User authentication             |
| **Tailwind CSS** | Styling                         |
| **shadcn/ui**    | UI components                   |
| **dnd-kit**      | Drag and drop functionality     |

---

## 📁 Project Structure

```
my-app/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout (providers)
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── boards/
│   │   └── [id]/
│   │       └── page.tsx     # Individual board page
│   └── dashboard/
│       └── page.tsx         # Dashboard with all boards
│
├── components/               # Reusable components
│   ├── navbar.tsx           # Navigation bar
│   └── ui/                  # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       └── ...
│
├── lib/                      # Core logic
│   ├── utils.ts             # Utility functions
│   ├── services.ts          # Database operations (CRUD)
│   ├── hooks/
│   │   └── useBoards.ts     # Custom React hooks
│   └── supabase/
│       ├── client.ts        # Supabase client setup
│       ├── server.ts        # Server-side Supabase
│       ├── models.ts        # TypeScript types
│       └── SupabaseProvider.tsx  # Context provider
│
├── middleware.ts            # Auth middleware (Clerk)
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account

### Step 1: Clone and Install

```bash
git clone <your-repo-url>
cd my-app
npm install
```

### Step 2: Environment Variables

Create `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Step 3: Set Up Supabase Database

Run these SQL commands in Supabase SQL Editor:

```sql
-- Create boards table
CREATE TABLE boards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(50) DEFAULT 'bg-blue-500',
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create columns table
CREATE TABLE columns (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  board_id INTEGER REFERENCES boards(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee VARCHAR(255),
  due_date DATE,
  priority VARCHAR(20) DEFAULT 'medium',
  column_id INTEGER REFERENCES columns(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies (allow users to access their own data)
CREATE POLICY "Users can access own boards" ON boards
  FOR ALL USING (auth.uid()::text = user_id);
```

### Step 4: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗃 Database Schema

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   boards    │       │   columns   │       │    tasks    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │───┐   │ id          │───┐   │ id          │
│ title       │   │   │ title       │   │   │ title       │
│ description │   └──>│ board_id    │   └──>│ column_id   │
│ color       │       │ user_id     │       │ description │
│ user_id     │       │ sort_order  │       │ assignee    │
│ created_at  │       │ created_at  │       │ due_date    │
└─────────────┘       └─────────────┘       │ priority    │
                                            │ sort_order  │
                                            │ created_at  │
                                            └─────────────┘
```

**Relationships:**

- One Board → Many Columns
- One Column → Many Tasks

---

## 🏗 Architecture Explained

### The Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                            │
│                    (React Components - page.tsx)                  │
└───────────────────────────┬──────────────────────────────────────┘
                            │ calls
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                      CUSTOM HOOKS                                 │
│                     (useBoards.ts)                                │
│   • Manages React state                                          │
│   • Calls services                                               │
│   • Returns data + functions to UI                               │
└───────────────────────────┬──────────────────────────────────────┘
                            │ calls
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       SERVICES                                    │
│                     (services.ts)                                 │
│   • Pure database operations                                     │
│   • No React, no state                                           │
│   • Returns data from Supabase                                   │
└───────────────────────────┬──────────────────────────────────────┘
                            │ queries
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                       SUPABASE                                    │
│                   (PostgreSQL Database)                          │
└──────────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

1. **Separation of Concerns**: Each layer has one job
2. **Reusability**: Services can be used anywhere
3. **Testability**: Easy to test each layer
4. **Maintainability**: Easy to find and fix bugs

---

## 📄 File-by-File Explanation

### `/lib/supabase/models.ts` - TypeScript Types

```typescript
// Defines the shape of our data
export interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  user_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  assignee: string | null;
  due_date: string | null;
  priority: "low" | "medium" | "high";
  column_id: string;
  sort_order: number;
  created_at: string;
}
```

**Purpose**: Tells TypeScript what our data looks like. Helps catch errors early.

---

### `/lib/services.ts` - Database Operations

```typescript
export const taskService = {
  // Get all tasks for a board
  async getTasksByBoard(supabase, boardId) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("board_id", boardId);
    return data;
  },

  // Create a new task
  async createTask(supabase, task) {
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select()
      .single();
    return data;
  },

  // Update a task
  async updateTask(supabase, taskId, updates) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", taskId)
      .select()
      .single();
    return data;
  },
};
```

**Purpose**: All database operations in one place. Pure functions, no React.

---

### `/lib/hooks/useBoards.ts` - Custom React Hooks

```typescript
export function useBoard(boardId: string) {
  // State
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);

  // Load data on mount
  useEffect(() => {
    loadBoard();
  }, [boardId]);

  // Function to update task
  async function updateTask(taskId, updates) {
    // 1. Update in database
    const updatedTask = await taskService.updateTask(supabase, taskId, updates);

    // 2. Update local state (so UI updates immediately)
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        tasks: col.tasks.map(task =>
          task.id === taskId ? updatedTask : task
        )
      }))
    );
  }

  // Return data and functions
  return { board, columns, updateTask, ... };
}
```

**Purpose**: Bridge between Services and UI. Manages React state.

---

### `/app/boards/[id]/page.tsx` - Board Page Component

```tsx
export default function BoardPage() {
  // Get data and functions from hook
  const { board, columns, updateTask } = useBoard(id);

  // State for dialogs
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Handler function
  async function handleUpdateTask(e) {
    e.preventDefault();
    await updateTask(editingTask.id, {
      title: editingTaskTitle,
      // ...
    });
    setIsEditingTask(false);
  }

  return (
    <div>
      {/* Columns */}
      {columns.map((column) => (
        <Column>
          {column.tasks.map((task) => (
            <TaskCard
              task={task}
              onEdit={() => {
                setEditingTask(task);
                setIsEditingTask(true);
              }}
            />
          ))}
        </Column>
      ))}

      {/* Edit Dialog */}
      <Dialog open={isEditingTask}>
        <form onSubmit={handleUpdateTask}>{/* Form fields */}</form>
      </Dialog>
    </div>
  );
}
```

**Purpose**: The actual UI. Uses hooks, handles user interactions.

---

## 🔧 How to Add New Features

### The 4-Step Process

Every new feature follows this pattern:

```
1. MODELS    → Define types (if needed)
2. SERVICES  → Add database function
3. HOOKS     → Add React function that uses service
4. UI        → Add buttons, dialogs, etc.
```

### Example: Adding "Delete Task" Feature

#### Step 1: Service (services.ts)

```typescript
// In taskService object
async deleteTask(supabase: SupabaseClient, taskId: string) {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw error;
}
```

#### Step 2: Hook (useBoards.ts)

```typescript
// In useBoard function
async function deleteTask(taskId: string) {
  // 1. Delete from database
  await taskService.deleteTask(supabase!, taskId);

  // 2. Update local state
  setColumns(prev =>
    prev.map(col => ({
      ...col,
      tasks: col.tasks.filter(task => task.id !== taskId)
    }))
  );
}

// Add to return statement
return { ..., deleteTask };
```

#### Step 3: UI (page.tsx)

```tsx
// Get deleteTask from hook
const { deleteTask } = useBoard(id);

// Add delete button in TaskCard
<Button onClick={() => deleteTask(task.id)}>Delete</Button>;
```

---

## 📝 Real Example: Adding Task Edit Feature

Here's exactly how we added the "Edit Task" feature step by step:

### 🤔 Step 1: Planning (Think First!)

**What do we need?**

1. A way to update task in database ✓
2. A way to call that from React ✓
3. A button to click ✓
4. A dialog/form to edit ✓
5. State to track what we're editing ✓

### 💾 Step 2: Add Service Function

**File: `/lib/services.ts`**

```typescript
// Inside taskService object
async updateTask(
  supabase: SupabaseClient,
  taskId: string,
  updates: Partial<Task>
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(updates)      // Send the new data
    .eq("id", taskId)     // Find task by ID
    .select()             // Return updated data
    .single();            // Expect one result

  if (error) throw error;
  return data;
}
```

### 🪝 Step 3: Add Hook Function

**File: `/lib/hooks/useBoards.ts`**

```typescript
// Inside useBoard function
async function updateTask(
  taskId: string,
  updates: {
    title?: string;
    description?: string | null;
    assignee?: string | null;
    due_date?: string | null;
    priority?: "low" | "medium" | "high";
  }
) {
  if (!user) {
    setError("User not authenticated");
    return;
  }

  try {
    // 1. Update database
    const updatedTask = await taskService.updateTask(
      supabase!,
      taskId,
      updates
    );

    // 2. Update React state (so UI shows new data)
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        tasks: col.tasks.map((task) =>
          task.id === taskId
            ? { ...task, ...updatedTask }  // Replace with new data
            : task                          // Keep unchanged
        ),
      }))
    );

    return updatedTask;
  } catch (err) {
    setError("Failed to update task.");
  }
}

// Don't forget to return it!
return { ..., updateTask };
```

### 🎨 Step 4: Add UI

**File: `/app/boards/[id]/page.tsx`**

```tsx
// 1. Get updateTask from hook
const { updateTask } = useBoard(id);

// 2. Add state variables
const [isEditingTask, setIsEditingTask] = useState(false);
const [editingTask, setEditingTask] = useState<Task | null>(null);
const [editingTaskTitle, setEditingTaskTitle] = useState("");
const [editingTaskDescription, setEditingTaskDescription] = useState("");
// ... more state for each field

// 3. Function to open edit dialog
function handleEditTask(task: Task) {
  setIsEditingTask(true);
  setEditingTask(task);
  setEditingTaskTitle(task.title);
  setEditingTaskDescription(task.description || "");
  // ... set other fields
}

// 4. Function to save changes
async function handleUpdateTask(e: React.FormEvent) {
  e.preventDefault();

  if (!editingTaskTitle.trim() || !editingTask) return;

  await updateTask(editingTask.id, {
    title: editingTaskTitle.trim(),
    description: editingTaskDescription || null,
    // ... other fields
  });

  // Close dialog and reset
  setIsEditingTask(false);
  setEditingTask(null);
  // ... reset other fields
}

// 5. Add edit button in TaskCard component
<Button onClick={() => handleEditTask(task)}>
  <MoreHorizontal />
</Button>

// 6. Add the Dialog
<Dialog open={isEditingTask} onOpenChange={setIsEditingTask}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Task</DialogTitle>
    </DialogHeader>
    <form onSubmit={handleUpdateTask}>
      <Input
        value={editingTaskTitle}
        onChange={(e) => setEditingTaskTitle(e.target.value)}
      />
      {/* More form fields */}
      <Button type="submit">Save Changes</Button>
    </form>
  </DialogContent>
</Dialog>
```

---

## ✅ Best Practices

### 1. Always Update Both Database AND State

```typescript
// ❌ Bad - only updates database, UI won't change
await taskService.updateTask(supabase, taskId, updates);

// ✅ Good - updates database then state
const updated = await taskService.updateTask(supabase, taskId, updates);
setColumns(prev => /* update state */);
```

### 2. Handle Errors

```typescript
try {
  await updateTask(taskId, updates);
} catch (error) {
  console.error("Error:", error);
  // Show error to user
}
```

### 3. Prevent Default on Forms

```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault(); // ← Important! Prevents page reload
  // ... your code
}
```

### 4. Validate Before Submitting

```typescript
if (!title.trim()) return; // Don't submit empty title
```

### 5. Clean Up After Closing Dialogs

```typescript
setIsEditing(false);
setEditingItem(null);
setFormField(""); // Reset all form fields
```

---

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

**Made with ❤️ for learning**

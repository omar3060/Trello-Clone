"use client";

import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBoard } from "@/lib/hooks/useBoards";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Trash2,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ColumnWithTasks, Task, Comment } from "@/lib/supabase/models";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Component For Column
function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
  onDeleteColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
  onDeleteColumn: (columnId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:shrink-0 lg:w-80 ${
        isOver ? "bg-blue-50 rounded-lg" : ""
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-sm border ${
          isOver ? "ring-2 ring-blue-300" : ""
        }`}
      >
        {/* Column Header */}
        <div className="p-3 sm:p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {column.title}
              </h3>
              <Badge variant={"secondary"} className="text-xs shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="shrink-0"
              onClick={() => onEditColumn(column)}
            >
              <MoreHorizontal />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Column</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete &quot;{column.title}&quot;?
                    This will also delete all {column.tasks.length} task(s) in
                    this column. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => onDeleteColumn(column.id)}
                  >
                    Delete Column
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {/* Colmn Contetn */}
        <div className="p-2">
          {children}
          {/* Add task dialog */}
          <Dialog>
            {/*Habd  */}
            {/* <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}> */}
            <DialogTrigger asChild>
              <Button
                variant={"ghost"}
                className="w-full mt-3 text-gray-500 hover:text-gray-700 "
              >
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <p className="text-sm text-gray-600">Add a task to the board</p>
              </DialogHeader>
              <form className="space-y-4" onSubmit={onCreateTask}>
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task Description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    name="assignee"
                    placeholder="Who should do this?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["low", "medium", "high"].map((priority, key) => (
                        <SelectItem key={key} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit">Create Task</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

// Component For Task
// Modified to support comments functionality
function SortableTask({
  task,
  onEditTask,
  onDeleteTask,
  getComments,
  addComment,
  deleteComment,
}: {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  getComments: (taskId: string) => Promise<Comment[]>;
  addComment: (taskId: string, content: string) => Promise<Comment | null>;
  deleteComment: (commentId: string) => Promise<boolean>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function getPriorityColor(priority: "low" | "high" | "medium"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }

  // Load comments from API
  async function loadComments() {
    setLoadingComments(true);
    const loadedComments = await getComments(task.id);
    setComments(loadedComments);
    setLoadingComments(false);
  }

  // Toggle comments visibility
  async function toggleComments(e: React.MouseEvent) {
    e.stopPropagation();
    if (!showComments) {
      await loadComments();
    }
    setShowComments(!showComments);
  }

  // Add a new comment
  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!newComment.trim()) return;

    const comment = await addComment(task.id, newComment.trim());
    if (comment) {
      setComments([...comments, comment]);
      setNewComment("");
    }
  }

  // Delete a comment
  async function handleDeleteComment(commentId: string, e: React.MouseEvent) {
    e.stopPropagation();
    const success = await deleteComment(commentId);
    if (success) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  }

  return (
    <div ref={setNodeRef} style={styles} {...listeners} {...attributes}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* Task Header */}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
              {/* Edit button */}
              <Button
                variant={"ghost"}
                size={"sm"}
                className="shrink-0 h-8 w-8 p-0"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              {/* Delete button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="shrink-0 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{task.title}&quot;?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => onDeleteTask(task.id)}
                    >
                      Delete Task
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Task Description */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description || "No description."}
            </p>

            {/* Task Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />{" "}
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}
                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span className="truncate">{task.due_date}</span>
                  </div>
                )}
              </div>
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(
                  task.priority,
                )}`}
              />
            </div>

            {/* Comments Section */}
            <div className="border-t pt-2 mt-2">
              {/* Toggle comments button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between text-gray-500 hover:text-gray-700 h-8"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={toggleComments}
              >
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-3 w-3" />
                  <span className="text-xs">
                    {comments.length > 0
                      ? `${comments.length} Comments`
                      : "Add Comment"}
                  </span>
                </div>
                {showComments ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </Button>

              {/* Comments list */}
              {showComments && (
                <div
                  className="mt-2 space-y-2"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {loadingComments ? (
                    <p className="text-xs text-gray-400 text-center py-2">
                      Loading...
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-2">
                      No comments yet
                    </p>
                  ) : (
                    <div className="max-h-32 overflow-y-auto space-y-2">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 rounded p-2 text-xs group"
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium text-gray-700">
                              {comment.user_name || "Anonymous"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) =>
                                handleDeleteComment(comment.id, e)
                              }
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                          <p className="text-gray-600 mt-1">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment form */}
                  <form
                    onSubmit={handleAddComment}
                    className="flex space-x-1 mt-2"
                  >
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="h-7 text-xs flex-1"
                      onPointerDown={(e) => e.stopPropagation()}
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskOverlay({ task }: { task: Task }) {
  function getPriorityColor(priority: "low" | "high" | "medium"): string {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-yellow-500";
    }
  }
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Task Header */}
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
          </div>
          {/* Task Description */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description || "No description."}
          </p>
          {/* Task Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              {task.assignee && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <User className="h-3 w-3" />{" "}
                  <span className="truncate">{task.assignee}</span>
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span className="truncate">{task.due_date}</span>
                </div>
              )}
            </div>
            <div
              className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(
                task.priority,
              )}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const {
    board,
    updateBoard,
    columns,
    createRealTask,
    setColumns,
    moveTask,
    createColumn,
    updateColumn,
    deleteColumn,
    updateTask,
    deleteTask,
    // Comment functions
    getComments,
    addComment,
    deleteComment,
  } = useBoard(id);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  // Filter state
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterDueDate, setFilterDueDate] = useState("");
  const activeFilterCount = (filterPriority ? 1 : 0) + (filterDueDate ? 1 : 0);

  // Filter tasks based on selected criteria
  function getFilteredColumns() {
    if (!filterPriority && !filterDueDate) return columns;
    return columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => {
        if (filterPriority && task.priority !== filterPriority) return false;
        if (filterDueDate && task.due_date !== filterDueDate) return false;
        return true;
      }),
    }));
  }

  const filteredColumns = getFilteredColumns();

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTilte] = useState("");
  const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(
    null,
  );

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // === Task editing state ===
  // isEditingTask: controls dialog open/close
  const [isEditingTask, setIsEditingTask] = useState(false);
  // editingTask: the task being edited
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // Form fields for editing
  const [editingTaskTitle, setEditingTaskTitle] = useState("");
  const [editingTaskDescription, setEditingTaskDescription] = useState("");
  const [editingTaskAssignee, setEditingTaskAssignee] = useState("");
  const [editingTaskPriority, setEditingTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [editingTaskDueDate, setEditingTaskDueDate] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // habd
  // const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  async function handleUpdateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch {}
  }

  async function createTask(taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0];
    if (!targetColumn) {
      throw new Error("No column available to add task");
    }

    await createRealTask(targetColumn.id, taskData);
  }

  async function handleCreateTask(e: any) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };

    if (taskData.title.trim()) {
      await createTask(taskData);

      const trigger = document.querySelector(
        '[data-state="open"',
      ) as HTMLElement;
      if (trigger) trigger.click();
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  }
  // handle drag over
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId),
    );

    if (!sourceColumn) return;

    // Check if overId is a column (for cross-column drops) or a task (for reordering)
    let targetColumn = columns.find((col) => col.id === overId);

    if (!targetColumn) {
      // overId is a task, find its column
      targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overId),
      );
    }

    if (!targetColumn) return;

    if (sourceColumn.id === targetColumn.id) {
      const activeIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeId,
      );

      let overIndex = targetColumn.tasks.findIndex(
        (task) => task.id === overId,
      );

      // If overId is the column itself (empty space), append to end
      if (overIndex === -1) {
        overIndex = targetColumn.tasks.length;
      }

      if (activeIndex !== overIndex) {
        setColumns((prev: ColumnWithTasks[]) => {
          const newColumns = [...prev];
          const column = newColumns.find((col) => col.id === sourceColumn.id);
          if (column) {
            const tasks = [...column.tasks];
            const [removed] = tasks.splice(activeIndex, 1);
            tasks.splice(overIndex, 0, removed);
            column.tasks = tasks;
          }
          return newColumns;
        });
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId),
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
      }
    } else {
      // check to see if the task dropping is in the same column on another task
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId),
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overId),
      );

      if (sourceColumn && targetColumn) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === taskId,
        );
        const newIndex = targetColumn.tasks.findIndex(
          (task) => task.id === overId,
        );

        if (oldIndex !== newIndex) {
          await moveTask(taskId, targetColumn.id, newIndex);
        }
      }
    }
  }

  // create new column
  async function handleCreateColumn(e: React.FormEvent) {
    e.preventDefault();

    if (!newColumnTitle.trim()) return;

    await createColumn(newColumnTitle.trim());

    setNewColumnTitle("");
    setIsCreatingColumn(false);
  }
  // edit column title
  async function handleUpdateColumn(e: React.FormEvent) {
    e.preventDefault();

    if (!editingColumnTitle.trim() || !editingColumn) return;

    await updateColumn(editingColumn?.id, editingColumnTitle.trim());

    setEditingColumnTilte("");
    setIsEditingColumn(false);
    setEditingColumn(null);
  }

  function handleEditColumn(column: ColumnWithTasks) {
    setIsEditingColumn(true);
    setEditingColumn(column);
    setEditingColumnTilte(column.title);
  }

  // === Open task edit dialog ===
  // Takes the task and populates form fields with current data
  function handleEditTask(task: Task) {
    setIsEditingTask(true); // Open dialog
    setEditingTask(task); // Store task being edited
    setEditingTaskTitle(task.title); // Populate title
    setEditingTaskDescription(task.description || ""); // Populate description
    setEditingTaskAssignee(task.assignee || ""); // Populate assignee
    setEditingTaskPriority(task.priority); // Populate priority
    setEditingTaskDueDate(task.due_date || ""); // Populate due date
  }

  // === Save task edits ===
  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault(); // Prevent page reload

    // Validate title and task exist
    if (!editingTaskTitle.trim() || !editingTask) return;

    // Prepare update data
    const updatedData = {
      title: editingTaskTitle.trim(),
      description: editingTaskDescription.trim() || null,
      assignee: editingTaskAssignee.trim() || null,
      priority: editingTaskPriority,
      due_date: editingTaskDueDate || null,
    };

    try {
      await updateTask(editingTask.id, updatedData);
    } catch (error) {
      console.error("Error updating task:", error);
    }

    // Close dialog and clear fields
    setIsEditingTask(false);
    setEditingTask(null);
    setEditingTaskTitle("");
    setEditingTaskDescription("");
    setEditingTaskAssignee("");
    setEditingTaskPriority("medium");
    setEditingTaskDueDate("");
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          boardTitle={board?.title}
          onEditBoard={() => {
            setNewTitle(board?.title ?? "");
            setNewColor(board?.color ?? "");
            setIsEditingTitle(true);
          }}
          onFilterClick={() => setIsFilterOpen(true)}
          filterCount={activeFilterCount}
        />

        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
          <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
            <DialogHeader>Edit Board</DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateBoard}>
              <div className="space-y-2">
                <Label htmlFor="boardTitle">Board Title</Label>
                <Input
                  id="boardTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter board title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Board Color</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {[
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                    "bg-red-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-indigo-500",
                    "bg-gray-500",
                    "bg-orange-500",
                    "bg-teal-500",
                    "bg-cyan-500",
                    "bg-emerald-500",
                  ].map((color, key) => (
                    <button
                      key={key}
                      type="button"
                      className={`w-8 h-8 rounded-full ${color} ${
                        color === newColor
                          ? "ring-2 ring-offset-2 ring-gray-900"
                          : ""
                      }`}
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => setIsEditingTitle(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for Filter on Boards */}

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
            <DialogHeader>
              <DialogTitle>Filter Tasks</DialogTitle>
              <p className="text-sm text-gray-600">
                Filter tasks by priority, assignee, or due date
              </p>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex flex-wrap gap-2">
                  {["low", "medium", "high"].map((priority, key) => (
                    <Button
                      key={key}
                      variant={
                        filterPriority === priority ? "default" : "outline"
                      }
                      size={"sm"}
                      className="border border-gray-200"
                      onClick={() =>
                        setFilterPriority(
                          filterPriority === priority ? null : priority,
                        )
                      }
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={filterDueDate}
                  onChange={(e) => setFilterDueDate(e.target.value)}
                />
              </div>
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={() => {
                    setFilterPriority(null);
                    setFilterDueDate("");
                  }}
                >
                  Clear Filters
                </Button>
                <Button type="button" onClick={() => setIsFilterOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Board Content */}
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {/* Stat */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total Tasks:</span>
                {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
              </div>
            </div>

            {/* Add task dialog */}
            <Dialog>
              {/*Habd  */}
              {/* <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}> */}
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <p className="text-sm text-gray-600">
                    Add a task to the board
                  </p>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleCreateTask}>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter task title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter task Description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assignee</Label>
                    <Input
                      id="assignee"
                      name="assignee"
                      placeholder="Who should do this?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select name="priority" defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["low", "medium", "high"].map((priority, key) => (
                          <SelectItem key={key} value={priority}>
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input type="date" id="dueDate" name="dueDate" />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="submit">Create Task</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Board Columns */}

          <DndContext
            sensors={sensors}
            collisionDetection={rectIntersection}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div
              className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
            lg:pb-6 lg:px-2 lg:-mx-2 
            lg:custom-scrollbar
            space-y-4 lg:space-y-0"
            >
              {filteredColumns.map((column, key) => (
                <DroppableColumn
                  key={key}
                  column={column}
                  onCreateTask={handleCreateTask}
                  onEditColumn={handleEditColumn}
                  onDeleteColumn={(columnId) => deleteColumn(columnId)}
                >
                  <SortableContext
                    items={column.tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task, key) => (
                        <SortableTask
                          task={task}
                          key={key}
                          onEditTask={handleEditTask}
                          onDeleteTask={(taskId) => deleteTask(taskId)}
                          getComments={getComments}
                          addComment={addComment}
                          deleteComment={deleteComment}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              ))}

              <div className="w-full lg:shrink-0 lg:w-80">
                <Button
                  variant={"outline"}
                  className="w-full h-full min-h-[200px] border-dashed border-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsCreatingColumn(true)}
                >
                  <Plus />
                  Add another list
                </Button>
              </div>
              <DragOverlay>
                {activeTask ? <TaskOverlay task={activeTask} /> : null}
              </DragOverlay>
            </div>
          </DndContext>
        </main>
      </div>

      <Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
            <p className="text-sm text-grey-600">
              Add new column to organize your tasks
            </p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title...."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsCreatingColumn(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Column</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingColumn} onOpenChange={setIsEditingColumn}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
            <p className="text-sm text-grey-600">Update the column title</p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={editingColumnTitle}
                onChange={(e) => setEditingColumnTilte(e.target.value)}
                placeholder="Enter column title...."
                required
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  setIsEditingColumn(false);
                  setEditingColumnTilte("");
                  setEditingColumn(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Edit Column</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* === Task Edit Dialog === */}
      <Dialog open={isEditingTask} onOpenChange={setIsEditingTask}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <p className="text-sm text-gray-600">Update the task details</p>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateTask}>
            <div className="space-y-2">
              <Label htmlFor="editTaskTitle">Title *</Label>
              <Input
                id="editTaskTitle"
                value={editingTaskTitle}
                onChange={(e) => setEditingTaskTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTaskDescription">Description</Label>
              <Textarea
                id="editTaskDescription"
                value={editingTaskDescription}
                onChange={(e) => setEditingTaskDescription(e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTaskAssignee">Assignee</Label>
              <Input
                id="editTaskAssignee"
                value={editingTaskAssignee}
                onChange={(e) => setEditingTaskAssignee(e.target.value)}
                placeholder="Who should do this?"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={editingTaskPriority}
                onValueChange={(value: "low" | "medium" | "high") =>
                  setEditingTaskPriority(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["low", "medium", "high"].map((priority, key) => (
                    <SelectItem key={key} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editTaskDueDate">Due Date</Label>
              <Input
                type="date"
                id="editTaskDueDate"
                value={editingTaskDueDate}
                onChange={(e) => setEditingTaskDueDate(e.target.value)}
              />
            </div>

            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => {
                  // Close dialog and clear fields
                  setIsEditingTask(false);
                  setEditingTask(null);
                  setEditingTaskTitle("");
                  setEditingTaskDescription("");
                  setEditingTaskAssignee("");
                  setEditingTaskPriority("medium");
                  setEditingTaskDueDate("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

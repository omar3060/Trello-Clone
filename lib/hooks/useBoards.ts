import { useSupabase } from "./../supabase/SupabaseProvider";

import { useUser } from "@clerk/nextjs";
import {
  boardDataService,
  boardService,
  columnService,
  taskService,
  commentService,
} from "../services";
import { use, useEffect, useState } from "react";
import {
  Board,
  Column,
  ColumnWithTasks,
  Task,
  Comment,
} from "../supabase/models";
import { title } from "process";
import { SupabaseClient } from "@supabase/supabase-js";

export function useBoards() {
  const { user } = useUser();
  const { supabase } = useSupabase();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user, supabase]);

  async function loadBoards() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardService.getBoards(supabase!, user.id);
      setBoards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load board");
    } finally {
      setLoading(false);
    }
  }
  async function createBoard(boardData: {
    title: string;
    description?: string;
    color?: string;
  }) {
    if (!user) throw new Error("User not Authenticated");
    try {
      const newBoard = await boardDataService.createBoardWithDefaultColumns(
        supabase!,
        {
          ...boardData,
          userId: user.id,
        },
      );
      setBoards((prev) => [newBoard, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to crete board");
    }
  }

  async function deleteBoard(boardId: string) {
    try {
      await boardService.deleteBoard(supabase!, boardId);
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete board");
    }
  }

  return { boards, loading, error, createBoard, deleteBoard };
}

export function useBoard(boardId: string) {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const [board, setBoard] = useState<Board | null>(null);
  const [columns, setColumns] = useState<ColumnWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (boardId) {
      loadBoard();
    }
  }, [boardId, supabase]);

  async function loadBoard() {
    if (!boardId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await boardDataService.getBoardWithColumns(
        supabase!,
        boardId,
      );
      setBoard(data.board);
      setColumns(data.columnsWithTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load board");
    } finally {
      setLoading(false);
    }
  }
  async function updateBoard(boardId: string, updates: Partial<Board>) {
    try {
      const updatedBoard = await boardService.updateBoard(
        supabase!,
        boardId,
        updates,
      );
      setBoard(updatedBoard);
      return updatedBoard;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update the board",
      );
    }
  }

  async function createRealTask(
    columnId: string,
    taskData: {
      title: string;
      description?: string;
      assignee?: string;
      dueDate?: string;
      priority?: "low" | "medium" | "high";
    },
  ) {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      const newTask = await taskService.createTask(supabase!, {
        title: taskData.title,
        description: taskData.description || null,
        assignee: taskData.assignee || null,
        due_date: taskData.dueDate || null,
        column_id: columnId,
        sort_order:
          columns.find((col) => col.id === columnId)?.tasks.length || 0,
        priority: taskData.priority || "medium",
      });

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col,
        ),
      );

      return newTask;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create the task.",
      );
    }
  }

  // async function moveTask(taskId:string, newColumnId: string, newOrder: number) {
  //   try {
  //     await taskService.moveTask(supabase!, taskId, newColumnId, newOrder)

  //     setColumns((prev) => {
  //       const newColumns = [...prev]

  //       // find and remove task from the old column

  //       let taskToMove: Task | null = null
  //       for (const col of newColumns) {
  //         const taskIndex = col.tasks.findIndex(task => task.id === taskId)
  //         if (taskIndex !== -1) {
  //           taskToMove = col.tasks[taskIndex]
  //           col.tasks.splice(taskIndex, 1)
  //           break;
  //         }
  //       }

  //       if (taskToMove) {
  //         // add task to new column

  //         const targetColumn = newColumns.find(col => col.id === newColumnId)

  //         if(targetColumn) {
  //           targetColumn.tasks.splice(newOrder, 0, taskToMove)
  //         }
  //       }
  //       return newColumns
  //     })
  //   } catch (err) {
  //     setError(
  //       err instanceof Error ? err.message : "Failed to move task."
  //     );
  //   }
  // }

  async function moveTask(
    taskId: string,
    newColumnId: string,
    newOrder: number,
  ) {
    try {
      await taskService.moveTask(supabase!, taskId, newColumnId, newOrder);

      setColumns((prev) => {
        const newColumns = [...prev];

        // find and remove task from the old column
        let taskToMove: Task | null = null;
        for (const col of newColumns) {
          const taskIndex = col.tasks.findIndex((task) => task.id === taskId);
          if (taskIndex !== -1) {
            taskToMove = col.tasks[taskIndex];
            col.tasks.splice(taskIndex, 1);
            break;
          }
        }

        if (taskToMove) {
          // add task to the new column
          const targetColumn = newColumns.find((col) => col.id === newColumnId);
          if (targetColumn) {
            targetColumn.tasks.splice(newOrder, 0, taskToMove);
          }
        }

        return newColumns;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move the task.");
    }
  }

  async function createColumn(title: string) {
    if (!board || !user) return new Error("There is no board");

    try {
      const newColumn = await columnService.createColumn(supabase!, {
        title,
        board_id: board.id,
        sort_order: columns.length,
        user_id: user.id,
      });

      setColumns((prev) => [...prev, { ...newColumn, tasks: [] }]);
      return newColumn;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create column.");
    }
  }
  async function updateColumn(columnId: string, title: string) {
    if (!board || !user) return new Error("There is no board");

    try {
      const updatedColumn = await columnService.updateColumnTitle(
        supabase!,
        columnId,
        title,
      );

      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, ...updateColumn } : col,
        ),
      );
      return updatedColumn;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create column.");
    }
  }

  async function deleteColumn(columnId: string) {
    if (!board || !user) return;

    try {
      await columnService.deleteColumn(supabase!, columnId);
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete column.");
    }
  }

  // Update task by ID and sync state after database save
  async function updateTask(
    taskId: string,
    updates: {
      title?: string;
      description?: string | null;
      assignee?: string | null;
      due_date?: string | null;
      priority?: "low" | "medium" | "high";
    },
  ) {
    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      // 1. Update in database
      const updatedTask = await taskService.updateTask(
        supabase!,
        taskId,
        updates,
      );

      // 2. Update local state - find task across all columns
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task,
          ),
        })),
      );

      return updatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task.");
    }
  }

  // ==========================================
  // Comment Functions
  // ==========================================

  // Get comments for a specific task
  async function getComments(taskId: string): Promise<Comment[]> {
    try {
      const comments = await commentService.getCommentsByTask(
        supabase!,
        taskId,
      );
      return comments;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load comments.");
      return [];
    }
  }

  // Add a new comment
  async function addComment(
    taskId: string,
    content: string,
  ): Promise<Comment | null> {
    if (!user) {
      setError("User not authenticated");
      return null;
    }

    try {
      const newComment = await commentService.createComment(supabase!, {
        task_id: taskId,
        content: content,
        user_id: user.id,
        user_name: user.fullName || user.username || "Anonymous",
      });

      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment.");
      return null;
    }
  }

  // Delete a comment
  async function deleteComment(commentId: string): Promise<boolean> {
    try {
      await commentService.deleteComment(supabase!, commentId);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete comment.",
      );
      return false;
    }
  }

  async function deleteTask(taskId: string) {
    try {
      await taskService.deleteTask(supabase!, taskId);
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.id !== taskId),
        })),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    }
  }

  return {
    board,
    columns,
    loading,
    error,
    updateBoard,
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
  };
}

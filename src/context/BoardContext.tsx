import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import mockData from "../lib/mockData.json";

interface Task {
  id: string;
  title: string;
  description?: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface BoardData {
  columns: Column[];
  tasks: Record<string, Task>;
}

interface BoardContextType {
  board: BoardData;
  moveTask: (
    taskId: string,
    fromId: string,
    toId: string,
    index: number
  ) => void;
  editTask: (taskId: string, newTitle: string) => void;
  addTask: (columnId: string, title: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  syncing: boolean;
  error?: string;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [board, setBoard] = useState<BoardData>(mockData);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  // 🧠 History states
  const [history, setHistory] = useState<BoardData[]>([]);
  const [redoStack, setRedoStack] = useState<BoardData[]>([]);

  // ---- Simulate backend sync ----
  const simulateBackendSync = async (data: BoardData) => {
    setSyncing(true);
    setError(undefined);
    return new Promise<BoardData>((resolve, reject) => {
      setTimeout(() => {
        const failed = Math.random() < 0.2; // 20% failure rate
        if (failed) reject(new Error("Sync failed with backend "));
        else resolve(data);
      }, 1000);
    });
  };

  // ---- Load from localStorage on mount ----
  useEffect(() => {
    const saved = localStorage.getItem("board");
    if (saved) {
      setBoard(JSON.parse(saved));
    } else {
      setBoard(mockData);
      localStorage.setItem("board", JSON.stringify(mockData));
    }
  }, []);

  // ---- Helper: Save to localStorage ----
  const saveToLocalStorage = (data: BoardData) => {
    localStorage.setItem("board", JSON.stringify(data));
  };

  // ---- Helper: Push current board to history ----
  const pushToHistory = (prevBoard: BoardData) => {
    setHistory((h) => [...h, prevBoard]);
    setRedoStack([]); // clear redo stack when a new action happens
  };

  // ---- Undo ----
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setRedoStack((r) => [board, ...r]);
    setBoard(prev);
    saveToLocalStorage(prev);
  }, [board, history]);

  // ---- Redo ----
  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((r) => r.slice(1));
    setHistory((h) => [...h, board]);
    setBoard(next);
    saveToLocalStorage(next);
  }, [board, redoStack]);

  // ---- Move Task ----
  const moveTask = useCallback(
    (taskId: string, fromId: string, toId: string, index: number) => {
      const prevBoard = structuredClone(board);
      pushToHistory(prevBoard);

      const newBoard = structuredClone(board);
      const fromCol = newBoard.columns.find((c) => c.id === fromId)!;
      const toCol = newBoard.columns.find((c) => c.id === toId)!;

      fromCol.taskIds = fromCol.taskIds.filter((id) => id !== taskId);
      toCol.taskIds.splice(index, 0, taskId);

      setBoard(newBoard);

      simulateBackendSync(newBoard)
        .then((syncedData) => {
          saveToLocalStorage(syncedData);
          setSyncing(false);
        })
        .catch(() => {
          setError("Sync failed! Restoring last saved version...");
          const lastLocal = localStorage.getItem("board");
          if (lastLocal) setBoard(JSON.parse(lastLocal));
          setSyncing(false);
        });
    },
    [board]
  );

  // ---- Edit Task ----
  const editTask = useCallback(
    (taskId: string, newTitle: string) => {
      const prevBoard = structuredClone(board);
      pushToHistory(prevBoard);

      const newBoard = structuredClone(board);
      newBoard.tasks[taskId].title = newTitle;
      setBoard(newBoard);

      simulateBackendSync(newBoard)
        .then((syncedData) => {
          saveToLocalStorage(syncedData);
          setSyncing(false);
        })
        .catch(() => {
          setError("Sync failed! Restoring last saved version...");
          const lastLocal = localStorage.getItem("board");
          if (lastLocal) setBoard(JSON.parse(lastLocal));
          setSyncing(false);
        });
    },
    [board]
  );

  // ---- Add Task ----
  const addTask = useCallback(
    (columnId: string, title: string) => {
      const prevBoard = structuredClone(board);
      pushToHistory(prevBoard);

      const id = uuidv4();
      const newTask: Task = { id, title };

      const newBoard = structuredClone(board);
      newBoard.tasks[id] = newTask;
      const column = newBoard.columns.find((c) => c.id === columnId);
      if (column) column.taskIds.push(id);

      setBoard(newBoard);

      simulateBackendSync(newBoard)
        .then((syncedData) => {
          saveToLocalStorage(syncedData);
          setSyncing(false);
        })
        .catch(() => {
          setError("Sync failed! Restoring last saved version...");
          const lastLocal = localStorage.getItem("board");
          if (lastLocal) setBoard(JSON.parse(lastLocal));
          setSyncing(false);
        });
    },
    [board]
  );

  const value: BoardContextType = {
    board,
    moveTask,
    editTask,
    addTask,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
    syncing,
    error,
  };

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

// ---- Custom Hook ----
export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoard must be used inside BoardProvider");
  return context;
};

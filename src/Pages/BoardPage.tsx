import React, { useEffect } from "react";
import { DragDropContext,  DropResult } from "@hello-pangea/dnd";
import { useBoard } from "../context/BoardContext";
import Column from "../components/Column";

export const BoardPage = () => {
   const { board, moveTask, undo, redo } = useBoard();

   // ✅ Keyboard shortcuts for Undo / Redo
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.ctrlKey && e.key === "z") undo();
       if (e.ctrlKey && e.key === "y") redo();
     };
     window.addEventListener("keydown", handleKeyDown);
     return () => window.removeEventListener("keydown", handleKeyDown);
   }, [undo, redo]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If dropped outside or same position — do nothing
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    moveTask(
      draggableId,
      source.droppableId,
      destination.droppableId,
      destination.index
    );
  };

  if (!board || !board.columns) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading board...</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-wrap gap-6 bg-gray-100 ">
      {/* ✅ DragDropContext must wrap *all droppables* together */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {board.columns.map((col) => {
          const tasks = col.taskIds
            .map((id) => board.tasks[id])
            .filter(Boolean); // ✅ filter out any missing task
          return <Column key={String(col.id)} column={col} tasks={tasks} />;
        })}
      </DragDropContext>
    </div>
  );
};

export default BoardPage;

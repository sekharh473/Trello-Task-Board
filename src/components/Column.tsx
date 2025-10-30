import React, { useState, useCallback } from "react";
import {  Droppable, Draggable } from "@hello-pangea/dnd";
import { useBoard } from "../context/BoardContext";
import TaskCard from "./TaskCard";

const Column = ({ column, tasks }) => {
  const { addTask } = useBoard();
  const [newTitle, setNewTitle] = useState("");

  const handleAdd = useCallback(() => {
    if (!newTitle.trim()) return;
    addTask(column.id, newTitle);
    setNewTitle("");
  }, [newTitle, column.id, addTask]);

  return (
    <div className="w-72 bg-white rounded-lg shadow-sm p-4 flex flex-col">
      {/* Column title */}
      <h2 className="text-lg font-semibold mb-3">{column.title}</h2>

      {/* Droppable area */}
      <Droppable droppableId={String(column.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 min-h-[50px] rounded-md p-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={String(task.id)}
                draggableId={String(task.id)} // ✅ always string
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-2"
                  >
                    {/* ✅ remove extra key inside TaskCard */}
                    <TaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add new task */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Add task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white text-sm px-3 rounded hover:bg-blue-600 transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default React.memo(Column);


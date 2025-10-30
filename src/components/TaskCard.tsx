import React, { useState, useCallback } from "react";
import { useBoard } from "../context/BoardContext";

interface TaskCardProps {
  task: {
    id: string;
    title: string;
  };
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { editTask } = useBoard();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  // Save changes on blur or Enter key
  const handleSave = useCallback(() => {
    if (title.trim() && title !== task.title) {
      editTask(task.id, title.trim());
    }
    setEditing(false);
  }, [title, task.id, task.title, editTask]);

  return (
    <div
      className="bg-white border border-gray-200 rounded-md shadow-sm p-2 hover:shadow-md transition cursor-pointer"
      onClick={() => setEditing(true)}
    >
      {editing ? (
        <input
          autoFocus
          className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <p className="text-sm text-gray-800">{task.title}</p>
      )}
    </div>
  );
};

export default React.memo(TaskCard);

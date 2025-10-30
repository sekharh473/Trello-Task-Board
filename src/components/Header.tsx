import React from "react";
import { useBoard } from "../context/BoardContext";
import { RotateCcw, RotateCw } from "lucide-react";

const Header: React.FC = () => {
  const { syncing, error, undo, redo, canUndo, canRedo } = useBoard();

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-200 p-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800">
        Collaborative Task Board
      </h1>

      <div className="flex items-center gap-4">
        {/* Undo / Redo buttons */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded ${
            canUndo
              ? "hover:bg-gray-100 text-gray-800"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded ${
            canRedo
              ? "hover:bg-gray-100 text-gray-800"
              : "text-gray-400 cursor-not-allowed"
          }`}
          title="Redo (Ctrl+Y)"
        >
          <RotateCw size={18} />
        </button>

        {syncing && (
          <span className="text-sm text-blue-500 font-medium animate-pulse">
            🔄 Syncing…
          </span>
        )}
        {error && (
          <span className="text-sm text-red-500 font-medium">⚠️ {error}</span>
        )}
      </div>
    </header>
  );
};

export default Header;

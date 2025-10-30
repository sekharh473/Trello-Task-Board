import React from "react";
import { BoardProvider } from "./context/BoardContext";
import Header from "./components/Header";
import BoardPage from "./Pages/BoardPage";

const App = () => {
  return (
    <BoardProvider>
      <div className=" bg-gray-100 flex flex-col">
        {/* Header with live sync indicator */}
        <Header />

        {/* Main Board Section */}
        <main className="flex-1 p-6 ">
          <BoardPage />
        </main>
      </div>
    </BoardProvider>
  );
};

export default App;

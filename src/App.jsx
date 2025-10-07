import React, { useState } from "react";
import { BoardProvider } from "./context/BoardContext.jsx";
import BoardSelector from "./components/BoardSelector";
import Board from "./components/Board";
import CalendarView from "./components/CalendarView";
import ViewSwitcher from "./components/ViewSwitcher";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("board");

  return (
    <BoardProvider>
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">任務管理系統</h1>
          <div className="header-controls">
            <BoardSelector />
            <ViewSwitcher
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </header>
        <main className="app-main">
          {currentView === "board" ? <Board /> : <CalendarView />}
        </main>
      </div>
    </BoardProvider>
  );
}

export default App;

import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiChevronDown } from "react-icons/fi";
import { useBoard } from "../context/BoardContext.jsx";
import EditableTitle from "./EditableTitle.jsx";

const BoardSelector = () => {
  const { state, actions } = useBoard();
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingBoard, setIsAddingBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");

  const currentBoard = state.boards.find(
    (board) => board.id === state.currentBoardId
  );

  const handleAddBoard = () => {
    if (newBoardTitle.trim()) {
      const boardId = actions.addBoard(newBoardTitle.trim());
      actions.setCurrentBoard(boardId);
      setNewBoardTitle("");
      setIsAddingBoard(false);
      setIsOpen(false);
    }
  };

  const handleSelectBoard = (boardId) => {
    actions.setCurrentBoard(boardId);
    setIsOpen(false);
  };

  const handleDeleteBoard = (boardId, e) => {
    e.stopPropagation();
    if (window.confirm("確定要刪除這個看板嗎？此操作無法復原。")) {
      actions.deleteBoard(boardId);
      if (boardId === state.currentBoardId) {
        const remainingBoards = state.boards.filter(
          (board) => board.id !== boardId
        );
        if (remainingBoards.length > 0) {
          actions.setCurrentBoard(remainingBoards[0].id);
        }
      }
    }
  };

  return (
    <div className="board-selector">
      <div className="board-selector-header">
        <button
          className="board-selector-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="current-board-name">
            {currentBoard ? currentBoard.title : "選擇看板"}
          </span>
          <FiChevronDown className={`chevron ${isOpen ? "open" : ""}`} />
        </button>
      </div>

      {isOpen && (
        <div className="board-selector-dropdown">
          <div className="board-list">
            {state.boards.map((board) => (
              <div
                key={board.id}
                className={`board-item ${
                  board.id === state.currentBoardId ? "active" : ""
                }`}
                onClick={() => handleSelectBoard(board.id)}
              >
                <EditableTitle
                  initialTitle={board.title}
                  handleEdit={(title) => {
                    actions.updateBoard(board.id, { title });
                  }}
                  handleDelete={(e) => handleDeleteBoard(board.id, e)}
                />
              </div>
            ))}
          </div>

          <div className="board-selector-footer">
            {isAddingBoard ? (
              <div className="add-board-form">
                <input
                  type="text"
                  value={newBoardTitle}
                  onChange={(e) => setNewBoardTitle(e.target.value)}
                  className="add-board-input"
                  placeholder="輸入看板名稱..."
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddBoard();
                    } else if (e.key === "Escape") {
                      setIsAddingBoard(false);
                      setNewBoardTitle("");
                    }
                  }}
                />
                <div className="add-board-actions">
                  <button onClick={handleAddBoard} className="add-board-btn">
                    新增
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingBoard(false);
                      setNewBoardTitle("");
                    }}
                    className="cancel-add-btn"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingBoard(true)}
                className="add-board-button"
              >
                <FiPlus size={14} />
                新增看板
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardSelector;

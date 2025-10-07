import React, { useState } from "react";
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import List from "./List";
import { useBoard } from "../context/BoardContext.jsx";

const Board = () => {
  const { state, actions } = useBoard();
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [activeCard, setActiveCard] = useState(null);

  const currentBoard = state.boards.find(
    (board) => board.id === state.currentBoardId
  );

  const handleAddList = () => {
    if (newListTitle.trim()) {
      actions.addList(state.currentBoardId, newListTitle.trim());
      setNewListTitle("");
      setIsAddingList(false);
    }
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const card = findCardById(active.id);
    setActiveCard(card);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    const card = findCardById(active.id);
    if (!card) return;

    const sourceList = findListByCardId(active.id);
    const destinationList = findListByCardId(over.id) || findListById(over.id);

    if (!sourceList || !destinationList) return;

    const sourceIndex = sourceList.cards.findIndex((c) => c.id === active.id);
    const destinationIndex = destinationList.cards.findIndex(
      (c) => c.id === over.id
    );

    if (sourceList.id === destinationList.id) {
      // 同一個列表內移動
      if (sourceIndex === destinationIndex) return;
    } else {
      // 不同列表間移動
      actions.moveCard(
        state.currentBoardId,
        sourceList.id,
        destinationList.id,
        sourceIndex,
        destinationIndex >= 0 ? destinationIndex : destinationList.cards.length,
        card
      );
    }
  };

  const findCardById = (cardId) => {
    for (const list of currentBoard.lists) {
      const card = list.cards.find((c) => c.id === cardId);
      if (card) return card;
    }
    return null;
  };

  const findListByCardId = (cardId) => {
    return currentBoard.lists.find((list) =>
      list.cards.some((card) => card.id === cardId)
    );
  };

  const findListById = (listId) => {
    return currentBoard.lists.find((list) => list.id === listId);
  };

  if (!currentBoard) {
    return <div className="no-board">找不到看板</div>;
  }

  return (
    <div className="board">
      <div className="board-header">
        <h1 className="board-title">{currentBoard.title}</h1>
        <div className="board-actions">
          <button
            onClick={() => {
              const newTitle = prompt("請輸入新看板名稱:", currentBoard.title);
              if (newTitle && newTitle.trim()) {
                actions.updateBoard(state.currentBoardId, {
                  title: newTitle.trim(),
                });
              }
            }}
            className="edit-board-btn"
            title="編輯看板"
          >
            <FiEdit2 size={16} />
          </button>
        </div>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board-content">
          <div className="lists-container">
            {currentBoard.lists.map((list) => (
              <List
                key={list.id}
                list={list}
                boardId={state.currentBoardId}
                onAddCard={actions.addCard}
                onEditCard={actions.updateCard}
                onDeleteCard={actions.deleteCard}
                onEditList={actions.updateList}
                onDeleteList={actions.deleteList}
              />
            ))}

            {isAddingList ? (
              <div className="add-list-form">
                <input
                  type="text"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  className="add-list-input"
                  placeholder="輸入列表標題..."
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddList();
                    } else if (e.key === "Escape") {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }
                  }}
                />
                <div className="add-list-actions">
                  <button onClick={handleAddList} className="add-list-btn">
                    新增列表
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingList(false);
                      setNewListTitle("");
                    }}
                    className="cancel-add-btn"
                  >
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingList(true)}
                className="add-list-button"
              >
                <FiPlus size={16} />
                新增列表
              </button>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="card-drag-preview">
              <div className="card-header">
                <h4 className="card-title">{activeCard.title}</h4>
              </div>
              {activeCard.description && (
                <p className="card-description">{activeCard.description}</p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Board;

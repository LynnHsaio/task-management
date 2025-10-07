import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Card from "./Card";

const List = ({
  list,
  boardId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onEditList,
  onDeleteList,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingList, setIsEditingList] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);

  const { setNodeRef } = useDroppable({
    id: list.id,
  });

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(boardId, list.id, { title: newCardTitle.trim() });
      setNewCardTitle("");
      setIsAddingCard(false);
    }
  };

  const handleEditList = () => {
    if (listTitle.trim() && listTitle !== list.title) {
      onEditList(boardId, list.id, { title: listTitle.trim() });
    }
    setIsEditingList(false);
  };

  const handleCancelEdit = () => {
    setListTitle(list.title);
    setIsEditingList(false);
  };

  return (
    <div className="list">
      <div className="list-header">
        {isEditingList ? (
          <div className="list-title-edit">
            <input
              type="text"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              className="list-title-input"
              autoFocus
              onBlur={handleEditList}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleEditList();
                } else if (e.key === "Escape") {
                  handleCancelEdit();
                }
              }}
            />
          </div>
        ) : (
          <h3 className="list-title" onClick={() => setIsEditingList(true)}>
            {list.title}
          </h3>
        )}

        <div className="list-actions">
          <button
            onClick={() => setIsEditingList(true)}
            className="edit-list-btn"
            title="編輯列表"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDeleteList(boardId, list.id)}
            className="delete-list-btn"
            title="刪除列表"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      <div className="list-content" ref={setNodeRef}>
        <SortableContext
          items={list.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="cards-container">
            {list.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                onEdit={(cardId, updates) =>
                  onEditCard(boardId, list.id, cardId, updates)
                }
                onDelete={(cardId) => onDeleteCard(boardId, list.id, cardId)}
              />
            ))}
          </div>
        </SortableContext>

        {isAddingCard ? (
          <div className="add-card-form">
            <textarea
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="add-card-input"
              placeholder="輸入卡片標題..."
              autoFocus
              rows="2"
            />
            <div className="add-card-actions">
              <button onClick={handleAddCard} className="add-card-btn">
                新增卡片
              </button>
              <button
                onClick={() => {
                  setIsAddingCard(false);
                  setNewCardTitle("");
                }}
                className="cancel-add-btn"
              >
                取消
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="add-card-button"
          >
            <FiPlus size={16} />
            新增卡片
          </button>
        )}
      </div>
    </div>
  );
};

export default List;

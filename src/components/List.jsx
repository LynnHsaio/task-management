import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import Card from "./Card";
import EditableTitle from "./EditableTitle";

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

  const handleEdit = (title) => {
    onEditList(boardId, list.id, { title });
  };

  const handleDelete = () => {
    onDeleteList(boardId, list.id);
  };

  return (
    <div className="list">
      <EditableTitle
        initialTitle={list.title}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

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

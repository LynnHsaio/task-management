import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiEdit2, FiTrash2, FiCalendar, FiTag } from "react-icons/fi";
import { priorityOptions } from "../data/sampleData";

const Card = ({ card, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [editData, setEditData] = useState({
    title: card.title,
    description: card.description,
    priority: card.priority,
    dueDate: card.dueDate,
    labels: card.labels || [],
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: isButtonHovered,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onEdit(card.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: card.title,
      description: card.description,
      priority: card.priority,
      dueDate: card.dueDate,
      labels: card.labels || [],
    });
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    const option = priorityOptions.find((opt) => opt.value === priority);
    return option ? option.color : "#61bd4f";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW");
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  if (isEditing) {
    return (
      <div className="card-edit-form" style={style}>
        <div className="card-edit-header">
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            className="card-title-input"
            placeholder="卡片標題"
            autoFocus
          />
        </div>

        <textarea
          value={editData.description}
          onChange={(e) =>
            setEditData({ ...editData, description: e.target.value })
          }
          className="card-description-input"
          placeholder="卡片描述"
          rows="3"
        />

        <div className="card-edit-controls">
          <select
            value={editData.priority}
            onChange={(e) =>
              setEditData({ ...editData, priority: e.target.value })
            }
            className="priority-select"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={editData.dueDate}
            onChange={(e) =>
              setEditData({ ...editData, dueDate: e.target.value })
            }
            className="due-date-input"
          />
        </div>

        <div className="card-edit-actions">
          <button onClick={handleSave} className="save-btn">
            儲存
          </button>
          <button onClick={handleCancel} className="cancel-btn">
            取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
    >
      <div className="card-header">
        <h4 className="card-title">{card.title}</h4>
        <div
          className="card-actions"
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          <button
            onClick={() => setIsEditing(true)}
            className="edit-btn"
            title="編輯卡片"
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="delete-btn"
            title="刪除卡片"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {card.description && (
        <p className="card-description">{card.description}</p>
      )}

      <div className="card-meta">
        {card.priority && (
          <div
            className="priority-badge"
            style={{ backgroundColor: getPriorityColor(card.priority) }}
          >
            {priorityOptions.find((opt) => opt.value === card.priority)?.label}
          </div>
        )}

        {card.dueDate && (
          <div
            className={`due-date ${isOverdue(card.dueDate) ? "overdue" : ""}`}
          >
            <FiCalendar size={12} />
            <span>{formatDate(card.dueDate)}</span>
          </div>
        )}
      </div>

      {card.labels && card.labels.length > 0 && (
        <div className="card-labels">
          {card.labels.map((label, index) => (
            <span key={index} className="label-tag">
              <FiTag size={10} />
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card;

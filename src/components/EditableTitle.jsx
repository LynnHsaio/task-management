import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function EditableTitle({
  initialTitle,
  handleEdit,
  handleDelete = null,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleOpenEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEditTitle = () => {
    if (title.trim() && title !== initialTitle) {
      handleEdit(title.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTitle(initialTitle);
    setIsEditing(false);
  };

  return (
    <div className="header">
      {isEditing ? (
        <div className="title-edit">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
            autoFocus
            onBlur={handleEditTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditTitle();
              } else if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
          />
        </div>
      ) : (
        <h3 className="title" onClick={handleOpenEdit}>
          {initialTitle}
        </h3>
      )}

      <div className="title-actions">
        <button
          onClick={handleOpenEdit}
          className="edit-title-btn"
          title="編輯列表"
        >
          <FiEdit2 size={14} />
        </button>
        {handleDelete && (
          <button
            onClick={handleDelete}
            className="delete-title-btn"
            title="刪除列表"
          >
            <FiTrash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

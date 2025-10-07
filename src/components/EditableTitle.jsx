import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function EditableTitle({
  initialTitle,
  handleEdit,
  handleDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  const handleEditList = () => {
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
    <div className="list-header">
      {isEditing ? (
        <div className="list-title-edit">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="list-title-input"
            autoFocus
            onBlur={handleEditList}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditList();
              } else if (e.key === "Escape") {
                handleCancelEdit();
              }
            }}
          />
        </div>
      ) : (
        <h3 className="list-title" onClick={() => setIsEditing(true)}>
          {initialTitle}
        </h3>
      )}

      <div className="list-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="edit-list-btn"
          title="編輯列表"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          onClick={() => handleDelete()}
          className="delete-list-btn"
          title="刪除列表"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}

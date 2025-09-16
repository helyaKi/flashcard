import React, { useEffect } from "react";

function ContextMenu({ position, onClose, onEdit, onDelete }) {
  useEffect(() => {
    const handleClickOutside = () => onClose();
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      className="menu-modal"
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu button-container">
        <button className="standard-button" onClick={onEdit}>
          Edit
        </button>
        <button className="standard-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ContextMenu;

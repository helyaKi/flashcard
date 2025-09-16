import React, { useState } from "react";
import ContextMenu from "./ContextMenu";

function CategoryCard({
  category,
  onSelect,
  onStartQuiz,
  isAuthenticated,
  isAdmin,
  onEdit,
  onDelete,
  highlighted,
}) {
  const [menuPosition, setMenuPosition] = useState(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!isAuthenticated || !isAdmin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const closeContextMenu = () => setMenuPosition(null);

  return (
    <div
      className={`category-card card ${highlighted ? "highlighted" : ""}`}
      onClick={(e) => {
        if (!e.target.classList.contains("category-card__quiz-button")) {
          onSelect?.(category);
        }
      }}
      onContextMenu={handleContextMenu}
      onMouseLeave={closeContextMenu}
    >
      <h2 className="category-card__title">{category.name}</h2>
      {category.count !== undefined && (
        <p className="category-card__count secondary-text">
          {category.count} cards
        </p>
      )}

      <button
        className="category-card__quiz-button standard-button"
        onClick={(ev) => {
          ev.stopPropagation();
          onStartQuiz?.(category.id);
        }}
      >
        Start quiz
      </button>

      {menuPosition && (
        <ContextMenu
          position={menuPosition}
          onClose={closeContextMenu}
          onEdit={() => {
            closeContextMenu();
            onEdit?.(category);
          }}
          onDelete={() => {
            closeContextMenu();
            onDelete?.(category);
          }}
        />
      )}
    </div>
  );
}

export default CategoryCard;

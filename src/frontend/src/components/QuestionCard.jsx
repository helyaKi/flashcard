import React, { useState, useEffect } from "react";
import ContextMenu from "./ContextMenu";
import ShowCardModal from "./ShowCardModal";

function QuestionCard({
  question,
  isAuthenticated,
  isAdmin,
  currentCategory,
  onEdit,
  onDelete,
  quizStarted,
}) {
  const [menuPosition, setMenuPosition] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setShowModal(false);
  }, [question]);

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (e.target.tagName === "BUTTON") return;
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
      className="card"
      onContextMenu={handleContextMenu}
      onMouseLeave={closeContextMenu}
    >
      <h2 className="card__question">{question.question}</h2>

      <button
        className="show-answer standard-button"
        onClick={() => setShowModal(true)}
      ></button>

      {showModal && (
        <ShowCardModal
          question={question}
          onClose={() => setShowModal(false)}
        />
      )}

      {menuPosition && (
        <ContextMenu
          position={menuPosition}
          onClose={closeContextMenu}
          onEdit={() => {
            closeContextMenu();
            onEdit?.(question);
          }}
          onDelete={() => {
            closeContextMenu();
            onDelete?.(question);
          }}
        />
      )}
    </div>
  );
}

export default QuestionCard;

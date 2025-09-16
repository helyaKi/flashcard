import React, { useState } from "react";
import AddCategory from "./AddCategory";
import AddCard from "./AddCard";
import addIcon from "../assets/icons8-add-65.png";
import stopIcon from "../assets/icons8-stop-15.png";

function Sidebar({
  currentCategory,
  isAuthenticated,
  isAdmin,
  onCategoryAdded,
  onQuestionAdded,
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [hoveringRestricted, setHoveringRestricted] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
  const addDisabled = !isAuthenticated;

  return (
    <aside className="sidebar">
      <button
        className="sidebar__button"
        onClick={() => !addDisabled && setShowAdd((prev) => !prev)}
        disabled={addDisabled}
        onMouseEnter={() => addDisabled && setHoveringRestricted(true)}
        onMouseLeave={() => setHoveringRestricted(false)}
        onMouseMove={addDisabled ? handleMouseMove : undefined}
      >
        <img src={addIcon} alt="Add" />
      </button>

      {isAuthenticated && !addDisabled && !currentCategory && showAdd && (
        <AddCategory
          onCategoryAdded={(newCategory) => {
            onCategoryAdded?.(newCategory);
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {isAuthenticated && !addDisabled && currentCategory && showAdd && (
        <AddCard
          currentCategory={currentCategory}
          onQuestionAdded={() => {
            onQuestionAdded?.();
            setShowAdd(false);
          }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* <button
        className="sidebar__button"
        onClick={() => !deleteDisabled && setShowDelete((prev) => !prev)}
        disabled={deleteDisabled}
        onMouseEnter={() => deleteDisabled && setHoveringRestricted(true)}
        onMouseLeave={() => setHoveringRestricted(false)}
        onMouseMove={deleteDisabled ? handleMouseMove : undefined}
      >
        <img src={deleteIcon} alt="Delete" />
      </button>

      {isAuthenticated && isAdmin && !currentCategory && showDelete && (
        <DeleteCategory
          onCategoryDeleted={(id) => {
            onCategoryDeleted?.(id);
            setShowDelete(false);
          }}
          onClose={() => setShowDelete(false)}
        />
      )}
      {isAuthenticated && isAdmin && currentCategory && showDelete && (
        <DeleteCard
          currentCategory={currentCategory}
          onQuestionCardDeleted={(id) => {
            onQuestionDeleted?.(id);
            setShowDelete(false);
          }}
          onClose={() => setShowDelete(false)}
        />
      )} */}

      {hoveringRestricted && (
        <img
          src={stopIcon}
          className="sidebar__stop-sign"
          style={{
            top: `${cursorPos.y + 10}px`,
            left: `${cursorPos.x + 10}px`,
          }}
        />
      )}
    </aside>
  );
}

export default Sidebar;

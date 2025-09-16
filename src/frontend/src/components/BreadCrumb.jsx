import React from "react";

function Breadcrumb({ currentCategory, onBack }) {
  const handleHomeClick = (e) => {
    if (currentCategory) {
      e.preventDefault();
      onBack();
    }
  };

  return (
    <nav className="breadcrumb">
      <p>
        <a href="#" onClick={handleHomeClick}>
          Home
        </a>{" "}
        {currentCategory && (
          <>
            →{" "}
            <a href="#" onClick={(e) => e.preventDefault()}>
              {currentCategory.name}
            </a>
          </>
        )}
      </p>
    </nav>
  );
}

export default Breadcrumb;

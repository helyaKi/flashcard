import React from "react";
import ReactDOM from "react-dom";

function Modal({
  title,
  children,
  onClose,
  onConfirm,
  confirmText = "OK",
  isOpen,
  showConfirm = true,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button standard-button" onClick={onClose}>
          <span>x</span>
        </button>

        {title && <h2 className="modal-content__title">{title}</h2>}

        <div className="modal-body">{children}</div>

        {showConfirm && (
          <button className="standard-button" onClick={onConfirm}>
            {confirmText}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}

export default Modal;

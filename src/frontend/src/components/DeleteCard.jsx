import React, { useState } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function DeleteCard({ questionId, questionText, onClose, onQuestionDeleted }) {
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    try {
      const api = createApi();
      await api.delete(`/api/cards/${questionId}`);

      onQuestionDeleted?.(questionId);
      onClose();
    } catch (err) {
      console.error("Error deleting card:", err);

      const message =
        err.response?.data?.title ||
        err.response?.data?.message ||
        "Failed to delete card";
      setError(message);
    }
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={true}
      onConfirm={handleConfirm}
      confirmText="Delete"
    >
      <p>
        Are you sure you want to delete <strong>{questionText}</strong>{" "}
        flashcard?
      </p>

      <p
        key={error}
        onAnimationEnd={() => setError("")}
        className={`err-message ${error ? "show" : ""}`}
      >
        {error}
      </p>
    </Modal>
  );
}

export default DeleteCard;

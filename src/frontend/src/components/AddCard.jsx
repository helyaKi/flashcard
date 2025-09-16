import React, { useState } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function AddCard({ currentCategory, onClose, onQuestionAdded }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!question.trim() || !answer.trim()) {
      setError("Both question and answer are required");
      return;
    }

    try {
      const api = createApi();
      const response = await api.post("/api/cards", {
        question: question.trim(),
        answer: answer.trim(),
        categoryId: currentCategory.id,
      });

      const newCard = response.data;
      onQuestionAdded?.(newCard);
      onClose();
    } catch (err) {
      console.error("Error adding card:", err);
      setError("Failed to add card");
    }
  };

  return (
    <Modal
      title="Add a new flashcard"
      onClose={onClose}
      isOpen={true}
      onConfirm={handleConfirm}
    >
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Question"
        className="modal-content__input"
      />
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer"
        className="modal-content__input"
      />

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

export default AddCard;

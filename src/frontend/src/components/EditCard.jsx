import React, { useState } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function EditCard({
  questionId,
  initialQuestion,
  initialAnswer,
  onClose,
  onQuestionEdited,
  currentCategory,
}) {
  const [question, setQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState(initialAnswer);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!question.trim() || !answer.trim()) {
      setError("Both question and answer are required");
      return;
    }

    try {
      const api = createApi();
      const response = await api.put(`/api/cards/${questionId}`, {
        id: questionId,
        question: question.trim(),
        answer: answer.trim(),
        categoryId: currentCategory.id,
      });

      onQuestionEdited?.(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating card:", err);

      const message =
        err.response?.data?.title ||
        err.response?.data?.message ||
        "Failed to update card";
      setError(message);
    }
  };

  return (
    <Modal
      title="Edit Flashcard"
      onClose={onClose}
      isOpen={true}
      onConfirm={handleConfirm}
      confirmText="Edit"
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

export default EditCard;

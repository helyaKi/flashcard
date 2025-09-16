import React, { useState, useEffect } from "react";
import Modal from "./Modal";

function QuizModal({ question, onClose, onNext, onFinish, isLast, isOpen }) {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [question]);

  if (!question) return null;

  return (
    <Modal onClose={onClose} isOpen={isOpen} showConfirm={false}>
      <h2 className="modal-body__question">{question.question}</h2>

      <p className={`modal-body__answer ${showAnswer ? "show" : ""}`}>
        {question.answer}
      </p>

      <div className="button-container">
        <button
          className="standard-button"
          onClick={() => setShowAnswer((prev) => !prev)}
        >
          Show Answer
        </button>
        <button
          className="standard-button"
          onClick={isLast ? onFinish : onNext}
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </Modal>
  );
}

export default QuizModal;

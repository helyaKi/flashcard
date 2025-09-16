import React, { useState, useEffect } from "react";
import Modal from "./Modal";

function ShowModal({ question, onClose }) {
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(true);
  }, [question]);

  return (
    <Modal onClose={onClose} isOpen={true} showConfirm={false}>
      <div className="modal-body">
        <h2 className="modal-body__question">{question.question}</h2>
        <p className="show-card modal-body__answer">{question.answer}</p>
      </div>
    </Modal>
  );
}

export default ShowModal;

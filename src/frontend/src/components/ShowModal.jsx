import React from "react";
import Modal from "./Modal";

function ShowModal({ question, onClose }) {
  return (
    <Modal onClose={onClose} isOpen={true} showConfirm={false}>
      <h2 className="modal-body__question">{question.question}</h2>
      <p className="modal-body__answer secondary-text">{question.answer}</p>
    </Modal>
  );
}

export default ShowModal;

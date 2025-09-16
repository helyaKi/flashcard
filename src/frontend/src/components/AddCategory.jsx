import React, { useState } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function AddCategory({ onClose, onCategoryAdded }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const api = createApi();
      const response = await api.post("/api/categories", {
        name: name.trim(),
      });

      const newCategory = response.data;
      onCategoryAdded?.(newCategory);
      onClose();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category");
    }
  };

  return (
    <Modal
      title="Add a new category"
      onClose={onClose}
      isOpen={true}
      onConfirm={handleConfirm}
    >
      <textarea
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
        className="category-input modal-content__input"
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

export default AddCategory;

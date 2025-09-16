import React, { useState } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function EditCategory({ categoryId, initialName, onClose, onCategoryEdited }) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      const api = createApi();
      const response = await api.put(`/api/categories/${categoryId}`, {
        name: name.trim(),
      });

      const updatedCategory =
        response.data && Object.keys(response.data).length
          ? response.data.data ?? response.data
          : { id: categoryId, name: name.trim() };

      onCategoryEdited?.(updatedCategory);

      onClose();
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category");
    }
  };

  return (
    <Modal
      title="Edit Category"
      onClose={onClose}
      isOpen={true}
      onConfirm={handleConfirm}
      confirmText="Edit"
    >
      <textarea
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category name"
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

export default EditCategory;

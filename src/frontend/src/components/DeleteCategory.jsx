import React, { useState } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function DeleteCategory({
  categoryId,
  categoryName,
  onClose,
  onCategoryDeleted,
}) {
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");
    try {
      const api = createApi();
      await api.delete(`/api/categories/${categoryId}`);
      onCategoryDeleted?.(categoryId);
      onClose();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
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
        Are you sure you want to delete <strong>{categoryName}</strong>{" "}
        category?
      </p>

      {error && (
        <p
          key={error}
          onAnimationEnd={() => setError("")}
          className="err-message show"
        >
          {error}
        </p>
      )}
    </Modal>
  );
}

export default DeleteCategory;

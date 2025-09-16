import React, { useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import Pagination from "./Pagination";
import { createApi } from "../api/api";

const api = createApi();

function CategoryList({
  onCategorySelected,
  onStartQuiz,
  isAdmin,
  onCategoryAdded,
  onCategoryEdited,
  onCategoryDeleted,
  highlightedCategoryId,
}) {
  const [localCategories, setLocalCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    api
      .get(`/api/categories`, {
        params: { page, pageSize: itemsPerPage },
      })
      .then((res) => {
        setLocalCategories(res.data.data);
        setTotalCount(res.data.totalCount ?? res.data.TotalCount ?? 0);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          console.error("Unauthorized: Please log in.");
        } else {
          console.error("Failed to fetch categories:", err);
        }
      });
  }, [page]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleCategoryAdded = (newCategory) => {
    setShowAddModal(false);
    onCategoryAdded?.(newCategory);
    setPage(1);
  };

  const handleCategoryEdited = (updatedCategory) => {
    setEditingCategory(null);
    onCategoryEdited?.(updatedCategory);

    api
      .get(`/api/categories`, { params: { page, pageSize: itemsPerPage } })
      .then((res) => setLocalCategories(res.data.data))
      .catch(console.error);
  };

  const handleCategoryDeleted = (deletedId) => {
    setDeletingCategory(null);
    onCategoryDeleted?.(deletedId);

    api
      .get(`/api/categories`, { params: { page, pageSize: itemsPerPage } })
      .then((res) => setLocalCategories(res.data.data))
      .catch(console.error);
  };

  return (
    <div className="categories card-container">
      {localCategories.map((cat, index) => (
        <CategoryCard
          key={cat.id ?? `cat-${index}`}
          category={cat}
          onSelect={onCategorySelected}
          onStartQuiz={onStartQuiz}
          isAdmin={isAdmin}
          isAuthenticated={true}
          onEdit={(category) => setEditingCategory(category)}
          onDelete={(category) => setDeletingCategory(category)}
          highlighted={
            highlightedCategoryId && cat.id === highlightedCategoryId
          }
        />
      ))}

      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}

      {showAddModal && (
        <AddCategory
          onCategoryAdded={handleCategoryAdded}
          onClose={() => setShowAddModal(false)}
          isOpen={true}
        />
      )}

      {editingCategory && (
        <EditCategory
          categoryId={editingCategory.id}
          initialName={editingCategory.name}
          onClose={() => setEditingCategory(null)}
          onCategoryEdited={handleCategoryEdited}
        />
      )}

      {deletingCategory && (
        <DeleteCategory
          categoryId={deletingCategory.id}
          categoryName={deletingCategory.name}
          onClose={() => setDeletingCategory(null)}
          onCategoryDeleted={handleCategoryDeleted}
          isOpen={true}
        />
      )}
    </div>
  );
}

export default CategoryList;

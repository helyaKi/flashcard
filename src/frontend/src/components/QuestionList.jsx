import React, { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import EditCard from "./EditCard";
import DeleteCard from "./DeleteCard";
import Pagination from "./Pagination";
import { createApi } from "../api/api";

const api = createApi();

function QuestionList({
  currentCategory,
  isAdmin,
  refreshTrigger,
  quizStarted,
}) {
  const [questions, setQuestions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [editingCard, setEditingCard] = useState(null);
  const [deletingCard, setDeletingCard] = useState(null);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!currentCategory) {
      setQuestions([]);
      setTotalCount(0);
      return;
    }

    const fetchCards = async () => {
      try {
        const res = await api.get(`/api/cards/${currentCategory.id}`, {
          params: { page, pageSize: itemsPerPage },
        });
        setQuestions(res.data.data);
        setTotalCount(res.data.totalCount);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
      }
    };

    fetchCards();
  }, [currentCategory, page, refreshTrigger]);

  useEffect(() => {
    setPage(1);
  }, [currentCategory]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleQuestionEdited = (updatedCard) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedCard.id ? updatedCard : q))
    );
  };

  const handleQuestionAdded = (newCard) => {
    setPage(1);
  };

  const handleQuestionDeleted = (deletedId) => {
    if (questions.length === 1 && page > 1) {
      setPage(page - 1);
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== deletedId));
      setTotalCount((prev) => prev - 1);
    }
  };

  return (
    <div className="cards card-container">
      {questions.map((q) => (
        <QuestionCard
          key={`${q.id}-${page}`}
          question={q}
          isAdmin={isAdmin}
          isAuthenticated={true}
          currentCategory={currentCategory}
          onEdit={(question) => setEditingCard(question)}
          onDelete={(question) => setDeletingCard(question)}
          quizStarted={quizStarted}
        />
      ))}

      {totalPages > 1 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}

      {editingCard && (
        <EditCard
          questionId={editingCard.id}
          currentCategory={currentCategory}
          initialQuestion={editingCard.question}
          initialAnswer={editingCard.answer}
          onClose={() => setEditingCard(null)}
          onQuestionEdited={handleQuestionEdited}
        />
      )}

      {deletingCard && (
        <DeleteCard
          questionId={deletingCard.id}
          questionText={deletingCard.question}
          onClose={() => setDeletingCard(null)}
          onQuestionDeleted={handleQuestionDeleted}
        />
      )}
    </div>
  );
}

export default QuestionList;

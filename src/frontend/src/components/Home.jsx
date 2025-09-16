import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import CategoryList from "./CategoryList";
import QuestionList from "./QuestionList";
import QuizModal from "./QuizModal";
import Footer from "./Footer";
import BreadCrumb from "./BreadCrumb";
import { createApi } from "../api/api";

function Home({ isAuthenticated, isAdmin, searchTerm }) {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [refreshCardsTrigger, setRefreshCardsTrigger] = useState(0);

  const [highlightedCategoryId, setHighlightedCategoryId] = useState(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const savedCategory = sessionStorage.getItem("currentCategory");
    if (savedCategory) {
      setCurrentCategory(JSON.parse(savedCategory));
    }
  }, []);

  const loadCategories = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const api = createApi();
      const res = await api.get("/api/categories");
      setCategories(res.data.data ?? res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  }, [isAuthenticated]);

  const loadQuestions = useCallback(async () => {
    if (!currentCategory) return;
    try {
      const api = createApi();
      const res = await api.get(`/api/cards/${currentCategory.id}`);
      setQuestions(res.data.data ?? res.data);
    } catch (err) {
      console.error("Failed to load questions", err);
    }
  }, [currentCategory]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (!currentCategory) return;
    loadQuestions();
  }, [loadQuestions, currentCategory]);

  useEffect(() => {
    if (!searchTerm) {
      setSearchError("");
      return;
    }

    const foundCategory = categories.find(
      (c) => c?.name && c.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (foundCategory) {
      setSearchError("");
      setHighlightedCategoryId(foundCategory.id);
      setTimeout(() => setHighlightedCategoryId(null), 3000);
      return;
    }

    const searchCards = async () => {
      try {
        const api = createApi();
        const res = await api.get("/api/cards");
        const allCards = res.data.data ?? res.data;

        const foundCard = (allCards || []).find((q) => {
          const qText = q?.question ?? "";
          const aText = q?.answer ?? "";
          const term = searchTerm.toLowerCase();
          return (
            qText.toLowerCase().includes(term) ||
            aText.toLowerCase().includes(term)
          );
        });

        if (foundCard) {
          const foundCategoryFromList = categories.find(
            (c) => c.id === foundCard.categoryId
          );
          if (foundCategoryFromList) {
            setCurrentCategory(foundCategoryFromList);
            setQuestions([foundCard]);
            setSearchError("");
          } else {
            try {
              const catRes = await api.get(
                `/api/categories/${foundCard.categoryId}`
              );
              const cat =
                (catRes.data && (catRes.data.data ?? catRes.data)) || null;
              if (cat) {
                setCurrentCategory(cat);
                setQuestions([foundCard]);
                setSearchError("");
              } else {
                setSearchError("");
                setQuestions([foundCard]);
                setCurrentCategory(null);
              }
            } catch (err) {
              console.error("Failed to fetch card's category:", err);
              setCurrentCategory(null);
              setQuestions([foundCard]);
              setSearchError("");
            }
          }
        } else {
          setSearchError("No results found");
        }
      } catch (err) {
        console.error("Search failed:", err);
        setSearchError("Search error");
      }
    };

    searchCards();
  }, [searchTerm, categories]);

  const startIndex = (page - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const startQuiz = async (categoryId) => {
    try {
      const api = createApi();
      const res = await api.get(`/api/cards/${categoryId}`);
      const data = res.data.data ?? res.data;
      if (data && data.length > 0) {
        setQuizQuestions(data);
        setQuizIndex(0);
        setQuizOpen(true);
      }
    } catch (err) {
      console.error("Failed to start quiz", err);
    }
  };

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    sessionStorage.setItem("currentCategory", JSON.stringify(category));
  };

  const handleCategoryAdded = (newCategory) =>
    setCategories((prev) => [newCategory, ...prev]);
  const handleCategoryDeleted = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    if (currentCategory?.id === id) {
      setCurrentCategory(null);
      sessionStorage.removeItem("currentCategory");
    }
  };

  const handleQuestionAdded = () => {
    setRefreshCardsTrigger((prev) => prev + 1);
  };

  const handleQuestionDeleted = (id) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const handleCategoryEdited = (updatedCategory) =>
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );

  const handleQuizNext = () => {
    if (quizIndex < quizQuestions.length - 1) setQuizIndex((prev) => prev + 1);
  };
  const handleQuizFinish = () => {
    setQuizOpen(false);
    setQuizQuestions([]);
    setQuizIndex(0);
  };

  return (
    <div className="app">
      <main className="main">
        <div>
          <BreadCrumb
            currentCategory={currentCategory}
            onBack={() => {
              setCurrentCategory(null);
              sessionStorage.removeItem("currentCategory");
            }}
          />

          <div className="card-area">
            {!isAuthenticated ? (
              <p className="guest-message secondary-text">
                Please log in to see categories.
              </p>
            ) : searchError ? (
              <p className="search-err-message secondary-text">{searchError}</p>
            ) : !currentCategory ? (
              <CategoryList
                categories={paginatedCategories}
                highlightedCategoryId={highlightedCategoryId}
                onCategorySelected={handleCategorySelect}
                onStartQuiz={startQuiz}
                isAdmin={isAdmin}
                onCategoryAdded={handleCategoryAdded}
                onCategoryEdited={handleCategoryEdited}
                onCategoryDeleted={handleCategoryDeleted}
              />
            ) : (
              <QuestionList
                currentCategory={currentCategory}
                questions={questions}
                setQuestions={setQuestions}
                isAdmin={isAdmin}
                onQuestionAdded={handleQuestionAdded}
                onQuestionDeleted={handleQuestionDeleted}
                refreshTrigger={refreshCardsTrigger}
              />
            )}
          </div>
        </div>

        <Sidebar
          currentCategory={currentCategory}
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onCategoryAdded={handleCategoryAdded}
          onQuestionAdded={handleQuestionAdded}
        />
      </main>

      <Footer />

      {quizOpen && quizQuestions.length > 0 && (
        <QuizModal
          question={quizQuestions[quizIndex]}
          isOpen={quizOpen}
          onClose={handleQuizFinish}
          onNext={handleQuizNext}
          onFinish={handleQuizFinish}
          isLast={quizIndex === quizQuestions.length - 1}
        />
      )}
    </div>
  );
}

export default Home;

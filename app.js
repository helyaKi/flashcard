// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyCDdorV_XjCdiC6-yq3lnPi6BrLMnRFlow",
  authDomain: "flashcard-app-92d56.firebaseapp.com",
  projectId: "flashcard-app-92d56",
  storageBucket: "flashcard-app-92d56.appspot.com",
  messagingSenderId: "38614423923",
  appId: "1:38614423923:web:11454836f3a0c523fdcd06",
  measurementId: "G-PX1VX72VJ2",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const addButton = document.querySelectorAll(".sidebar-button")[0];
const deleteButton = document.querySelectorAll(".sidebar-button")[1];
const categoriesSection = document.querySelector(".categories");
const questionsSection = document.querySelector(".questions");

let currentCategory = null;
let quizData = [];
let quizIndex = 0;

const modal = document.querySelector(".quiz-section.popup-modal");
const quizQuestion = document.querySelector(".popup-container .question");
const quizAnswer = document.querySelector(".popup-container .answer");
const showAnswerBtn = document.querySelector(".show-answer");
const nextBtn = document.querySelector(".next-question");
const closeBtn = document.querySelector(".popup-close-button");

const POPUP_WIDTH = "400px";
const POPUP_HEIGHT = "300px";

function createCenteredPopup(
  title,
  innerHTMLContent,
  okCallback,
  cancelCallback
) {
  document
    .querySelectorAll(".popup-modal.custom-popup")
    .forEach((el) => el.remove());

  const popup = document.createElement("div");
  popup.className = "popup-modal custom-popup";
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.zIndex = 10000;
  popup.style.background = "var(--bg-white)";
  popup.style.borderRadius = "var(--standard-border-radius)";
  popup.style.boxShadow = "var(--standard-box-shadow)";
  popup.style.padding = "1rem";
  popup.style.width = POPUP_WIDTH;
  popup.style.height = POPUP_HEIGHT;
  popup.style.display = "flex";
  popup.style.flexDirection = "column";
  popup.style.gap = "0.5rem";

  popup.innerHTML = `
    <h2>${title}</h2>
    ${innerHTMLContent}
    <button class="popup-close-button" aria-label="Close">×</button>
    <div style="margin-top:auto; display:flex; justify-content:flex-end; gap:0.5rem;">
      <button class="ok-btn standard-button" style="color:black; background:white; border: 1px solid black; border-radius: 15px;">OK</button>
    </div>
  `;

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector(".popup-close-button");
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "red";
    closeBtn.style.color = "white";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "white";
    closeBtn.style.color = "black";
  });

  const okBtn = popup.querySelector(".ok-btn");
  okBtn.addEventListener("mouseenter", () => {
    okBtn.style.background = "black";
    okBtn.style.color = "white";
  });
  okBtn.addEventListener("mouseleave", () => {
    okBtn.style.background = "white";
    okBtn.style.color = "black";
  });

  closeBtn.onclick = () => {
    popup.remove();
    if (cancelCallback) cancelCallback();
  };

  okBtn.onclick = () => {
    if (okCallback) okCallback(popup);
  };

  return popup;
}

function showContextMenuPopup(
  type,
  docId,
  questionOrCategoryName,
  answerText = null,
  position = null
) {
  document
    .querySelectorAll(".popup-modal.menu-popup")
    .forEach((el) => el.remove());

  const popup = document.createElement("div");
  popup.className = "popup-modal menu-popup";

  if (position) {
    popup.style.top = position.y + "px";
    popup.style.left = position.x + "px";
    popup.style.transform = "none";
  } else {
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
  }

  popup.innerHTML = `
    <button class="popup-close-button" aria-label="Close">×</button>
    <div style="margin-top:auto; display:flex; flex-direction: column; gap: 0.5rem;">
      <button class="edit-btn standard-button">Edit</button>
      <button class="delete-btn standard-button">Delete</button>
    </div>
  `;

  document.body.appendChild(popup);

  const closeBtn = popup.querySelector(".popup-close-button");
  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "red";
    closeBtn.style.color = "white";
  });
  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "white";
    closeBtn.style.color = "black";
  });

  closeBtn.onclick = () => popup.remove();

  popup.querySelector(".delete-btn").onclick = () => {
    if (type === "category") {
      db.collection("categories")
        .doc(docId)
        .delete()
        .then(() => {
          popup.remove();
          window.dispatchEvent(new Event("DOMContentLoaded"));
        })
        .catch((err) => alert("Error deleting category: " + err.message));
    } else {
      db.collection("categories")
        .doc(currentCategory)
        .collection("questions")
        .doc(docId)
        .delete()
        .then(() => {
          popup.remove();
          showQuestionsForCategory(currentCategory);
        })
        .catch((err) => alert("Error deleting question: " + err.message));
    }
  };

  popup.querySelector(".edit-btn").onclick = () => {
    popup.remove();
    if (type === "category") {
      showEditCategoryPopup(docId, questionOrCategoryName);
    } else {
      showEditQuestionPopup(docId, questionOrCategoryName, answerText);
    }
  };
}

function showQuestionAnswerPopup(question, answer) {
  document
    .querySelectorAll(".popup-modal.card-content-show")
    .forEach((el) => el.remove());

  const popup = document.createElement("div");
  popup.className = "popup-modal card-content-show";
  popup.innerHTML = `
    <div style="flex-grow:1; overflow-y:auto; padding-top: 2rem;">
      <h2 style="align-self: left;">Question:</h2>
      <p>${question}</p>
      <h2 style="align-self: left;">Answer:</h2>
      <p>${answer}</p>
    </div>
    <button class="popup-close-button standard-button"style="text-align:center;">x</button>
  `;

  document.body.appendChild(popup);

  popup.querySelector(".popup-close-button").onclick = () => popup.remove();
}

async function showQuestionsForCategory(categoryId) {
  const qSnap = await db
    .collection("categories")
    .doc(categoryId)
    .collection("questions")
    .get();

  categoriesSection.style.display = "none";
  questionsSection.innerHTML = "";
  questionsSection.classList.add("card-container");
  questionsSection.style.display = "";

  qSnap.forEach((doc) => {
    const q = doc.data();
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h2>${q.question}</h2><p class="answer" style="display:none; opacity: 0; transition: opacity 0.5s ease;">${q.answer}</p>`;
    questionsSection.appendChild(card);

    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenuPopup("question", doc.id, q.question, q.answer, {
        x: e.clientX,
        y: e.clientY,
      });
    });

    card.addEventListener("click", () => {
      showQuestionAnswerPopup(q.question, q.answer);
    });
  });

  currentCategory = categoryId;
  history.pushState({ page: "questions" }, "", "");
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.page === "questions") {
    questionsSection.style.display = "grid";
    categoriesSection.style.display = "none";
  } else {
    questionsSection.style.display = "none";
    categoriesSection.style.display = "grid";
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const snapshot = await db.collection("categories").get();
  categoriesSection.innerHTML = "";
  questionsSection.style.display = "none";
  categoriesSection.style.display = "grid";
  categoriesSection.style.gridTemplateColumns =
    "repeat(auto-fit, minmax(200px, 1fr))";
  categoriesSection.style.gap = "16px";

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const categoryId = doc.id;

    const questionsSnap = await db
      .collection("categories")
      .doc(categoryId)
      .collection("questions")
      .get();
    const questionCount = questionsSnap.size;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${data.name}</h2>
      <p class="secondary-text">${questionCount}</p>
      <div class="button-container">
        <button class="start-quiz-button standard-button">Start quiz</button>
      </div>
    `;
    categoriesSection.appendChild(card);

    card.addEventListener("click", async (e) => {
      if (!e.target.classList.contains("start-quiz-button")) {
        currentCategory = categoryId;
        await showQuestionsForCategory(currentCategory);
      }
    });

    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showContextMenuPopup("category", categoryId, data.name);
    });

    const startBtn = card.querySelector(".start-quiz-button");
    startBtn.addEventListener("click", async () => {
      currentCategory = categoryId;
      quizData = [];

      const qSnap = await db
        .collection("categories")
        .doc(currentCategory)
        .collection("questions")
        .get();
      qSnap.forEach((doc) => {
        const q = doc.data();
        quizData.push({ question: q.question, answer: q.answer });
      });

      quizIndex = 0;
      showQuizQuestion();
    });
  }
});

addButton.addEventListener("click", () => {
  if (!currentCategory) {
    showAddCategoryPopup();
  } else {
    showAddQuestionPopup();
  }
});

deleteButton.addEventListener("click", () => {
  if (!currentCategory) {
    alert("Please select a category to delete");
  } else {
    showDeleteCategoryPopupById(currentCategory);
  }
});

function showAddCategoryPopup() {
  const innerHTML = `<textarea id="category-name" class="popup-input popup-category-field show" placeholder="Category Name" style="resize:none;"></textarea>`;
  createCenteredPopup("Add a new category", innerHTML, (popup) => {
    const name = popup.querySelector(".popup-category-field").value.trim();
    if (!name) {
      alert("Category name is required");
      return;
    }
    db.collection("categories")
      .add({ name })
      .then(() => {
        popup.remove();
        window.dispatchEvent(new Event("DOMContentLoaded"));
      })
      .catch((err) => alert("Error adding category: " + err.message));
  });
}

function showAddQuestionPopup() {
  const innerHTML = `
    <textarea id="question-text" class="popup-input add-question-input" placeholder="Question" style="resize:none; width:95%; height:20%;"></textarea>
    <textarea id="answer-text" class="popup-input add-answer-input" placeholder="Answer" style="resize:none; width:95%; height:60%;"></textarea>
  `;

  createCenteredPopup("Add a new flashcard", innerHTML, async (popup) => {
    const question = popup.querySelector(".add-question-input").value.trim();
    const answer = popup.querySelector(".add-answer-input").value.trim();
    if (!question || !answer) {
      alert("Both question and answer are required.");
      return;
    }
    await db
      .collection("categories")
      .doc(currentCategory)
      .collection("questions")
      .add({ question, answer });
    popup.remove();
    await showQuestionsForCategory(currentCategory);
  });
}

function showDeleteCategoryPopupById(categoryId) {
  db.collection("categories")
    .doc(categoryId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        alert("Category not found");
        return;
      }
      showDeleteCategoryPopup(doc.data().name);
    });
}

function showDeleteCategoryPopup(categoryName) {
  const innerHTML = `
    <label class="popup-label" style="text-align:left;">Category Name</label>
    <textarea class="popup-input popup-category-field show" placeholder="Category Name" style="resize:none; width:95%; height:60%;"></textarea>
  `;

  const popup = createCenteredPopup("Delete Category", innerHTML, (popup) => {
    const inputName = popup.querySelector(".popup-category-field").value.trim();
    if (!inputName) {
      alert("Category name is required");
      return;
    }
    if (inputName !== categoryName) {
      alert("Category name does not match.");
      return;
    }
    db.collection("categories")
      .where("name", "==", inputName)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          alert("Category not found");
          return;
        }
        snapshot.forEach((doc) => doc.ref.delete());
        window.dispatchEvent(new Event("DOMContentLoaded"));
      });
    popup.remove();
  });

  popup.querySelector(".popup-category-field").value = categoryName;
}

function showEditCategoryPopup(categoryId, currentName) {
  const innerHTML = `
    <label class="popup-label" style="text-align:left;">Category Name</label>
    <textarea class="popup-input edit-category-input" placeholder="Category Name" style="resize:none; width:95%; height:60%;">${currentName}</textarea>
  `;

  const popup = createCenteredPopup("Edit Category", innerHTML, (popup) => {
    const newName = popup.querySelector(".edit-category-input").value.trim();
    if (!newName) {
      alert("Category name cannot be empty");
      return;
    }
    db.collection("categories")
      .doc(categoryId)
      .update({ name: newName })
      .then(() => {
        popup.remove();
        window.dispatchEvent(new Event("DOMContentLoaded"));
      })
      .catch((err) => alert("Error updating category: " + err.message));
  });
}

function showEditQuestionPopup(questionDocId, currentQuestion, currentAnswer) {
  const innerHTML = `
    <label class="popup-label" style="text-align:left;">Question</label>
    <textarea class="popup-input edit-question-input" style="resize:none; width:95%; height:40%;">${currentQuestion}</textarea>
    <label class="popup-label" style="text-align:left;">Answer</label>
    <textarea class="popup-input edit-answer-input" style="resize:none; width:95%; height:40%;">${currentAnswer}</textarea>
  `;

  const popup = createCenteredPopup(
    "Edit Question",
    innerHTML,
    async (popup) => {
      const newQuestion = popup
        .querySelector(".edit-question-input")
        .value.trim();
      const newAnswer = popup.querySelector(".edit-answer-input").value.trim();
      if (!newQuestion || !newAnswer) {
        alert("Both question and answer are required.");
        return;
      }
      await db
        .collection("categories")
        .doc(currentCategory)
        .collection("questions")
        .doc(questionDocId)
        .update({ question: newQuestion, answer: newAnswer });
      popup.remove();
      await showQuestionsForCategory(currentCategory);
    }
  );
}

// Quiz logic
function showQuizQuestion() {
  if (quizIndex >= quizData.length) {
    alert("Quiz completed!");
    modal.style.display = "none";
    return;
  }

  const q = quizData[quizIndex];
  quizQuestion.textContent = q.question;
  quizAnswer.textContent = q.answer;
  quizAnswer.style.display = "none";

  modal.style.display = "flex";
}

showAnswerBtn.addEventListener("click", () => {
  quizAnswer.style.display = "block";
});

nextBtn.addEventListener("click", () => {
  quizIndex++;
  showQuizQuestion();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

# Flashcard Quiz Project

A simple flashcard quiz web application built with **HTML**, **CSS**, and **JavaScript**, using **Firebase Firestore** as the backend database.

---

## Features

- Manage categories of flashcards
- Add, edit, and delete categories
- Add, edit, and delete questions and answers within categories
- View flashcards in category and question views
- Start quizzes on any category with flashcards
- Popup modals for adding, editing, deleting, and quiz interface
- Context menus for quick edit and delete options

---

## Usage

- On load, categories are fetched from Firestore.
- Click a category to view its flashcards.
- Right-click a category or flashcard to see edit/delete options.
- Use the "Add" button to add new categories or flashcards.
- Use the "Start Quiz" button to start a quiz on a selected category.
- Use the quiz popup to navigate questions and reveal answers.

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Firebase Firestore (No server-side code)
- **Hosting:** Can be hosted on Firebase Hosting or any static hosting

---

## Notes

- Your Firebase config is currently embedded directly in app.js. For production, consider moving sensitive data into environment variables or use Firebase Hosting configuration.
- This project does not include user authentication; all data is public.
- The UI uses popup modals and context menus for interaction.

## License

This project is open source and available under the MIT License.

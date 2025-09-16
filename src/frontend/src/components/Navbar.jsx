import React from "react";

function Navbar({
  searchTerm,
  setSearchTerm,
  isAuthenticated,
  onLogout,
  openLogin,
}) {
  const handleSearch = (e) => {
    const value = e.target.value;
    if (setSearchTerm) setSearchTerm(value);
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      if (onLogout) onLogout();
    } else {
      if (openLogin) openLogin();
    }
  };

  return (
    <header className="header">
      <h1>Flashcard Quiz App</h1>
      <nav className="navbar">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="navbar__searchbar"
        />
        <button onClick={handleAuthClick} className="standard-button">
          {isAuthenticated ? "Sign Out" : "Sign In"}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;

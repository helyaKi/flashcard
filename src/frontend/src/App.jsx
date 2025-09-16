import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import "./App.css";

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    isAdmin: false,
    username: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");
    const username = sessionStorage.getItem("username");
    if (token && role && username) {
      setAuth({
        isAuthenticated: true,
        isAdmin: role === "admin",
        username,
      });
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setAuth({ isAuthenticated: false, isAdmin: false, username: "" });
  };

  const handleLogin = ({ token, username, role }) => {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("role", role);
    setAuth({
      isAuthenticated: true,
      isAdmin: role === "admin",
      username,
    });
    setLoginOpen(false);
  };

  return (
    <div className="app">
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isAuthenticated={auth.isAuthenticated}
        onLogout={handleLogout}
        openLogin={() => setLoginOpen(true)}
      />

      <Home
        isAuthenticated={auth.isAuthenticated}
        isAdmin={auth.isAdmin}
        searchTerm={searchTerm}
      />

      <LoginForm
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;

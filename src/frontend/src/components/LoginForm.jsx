import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { createApi } from "../api/api";

function LoginForm({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setIsSignup(false);
    }
  }, [isOpen]);

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username & password are required");
      return;
    }

    if (isSignup) {
      if (!role) {
        setError("Please select a role");
        return;
      }
      if (!confirmPassword) {
        setError("Confirm password is required");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    try {
      const api = createApi();
      const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login";
      const data = isSignup
        ? { username, password, role: role.toLowerCase() }
        : { username, password };

      const res = await api.post(endpoint, data);
      const { token, username: returnedUser, role: returnedRole } = res.data;

      if (!token || !returnedUser || !returnedRole) {
        throw new Error("Incomplete response from server");
      }

      onLogin?.({
        token,
        username: returnedUser,
        role: returnedRole.toLowerCase(),
      });

      if (onClose) onClose();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        isSignup
          ? err.response?.status === 409
            ? "Username already exists"
            : "Registration failed"
          : err.response?.status === 401
          ? "Invalid username or password"
          : "Login failed"
      );
    }
  };

  const toggleSignup = () => {
    setIsSignup((prev) => !prev);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showConfirm={false}>
      <form onSubmit={handleSubmit} id="login-form" className="card-container">
        {isSignup && (
          <p className="role-selection">
            <a
              href="#"
              className={role === "user" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setRole((prev) => (prev === "user" ? "" : "user"));
              }}
            >
              User
            </a>
            <a
              href="#"
              className={role === "admin" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setRole((prev) => (prev === "admin" ? "" : "admin"));
              }}
            >
              Admin
            </a>
          </p>
        )}

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-form modal-content__input"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-form modal-content__input"
        />
        {isSignup && (
          <input
            type="password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="login-form modal-content__input"
          />
        )}

        <button
          type="submit"
          id="login-form__button"
          className="standard-button"
        >
          {isSignup ? "Sign Up" : "Login"}
        </button>
      </form>

      <p
        key={error}
        onAnimationEnd={() => setError("")}
        className={`err-message ${error ? "show" : ""}`}
      >
        {error}
      </p>

      <p className="secondary-text auth-toggle-text">
        {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
        <a href="#" id="link-button" onClick={toggleSignup}>
          {isSignup ? "Login" : "Sign Up"}
        </a>
      </p>
    </Modal>
  );
}

export default LoginForm;

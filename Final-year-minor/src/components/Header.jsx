// src/components/Header.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // ✅ FIXED LOGIN STATE (reactive)
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth();

    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">

          <Link to="/" className="logo">
            <span>AI Studio</span>
          </Link>

          <ul className="nav-links">
            <li><a href="#examples">Examples</a></li>
            <li><a href="#tools">Tools</a></li>
          </ul>

          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <Link to="/generator" className="launch-btn">
                  Launch Studio
                </Link>
                <button className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-btn">
                  Login
                </Link>
                <Link to="/register" className="register-btn">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

        </nav>

        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
          <a href="#examples" onClick={closeMobileMenu}>Examples</a>

          {isLoggedIn ? (
            <>
              <Link to="/generator" onClick={closeMobileMenu}>
                Launch Studio
              </Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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

          {/* Logo */}
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>AI Studio</span>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            <li><a href="#examples">Examples</a></li>
            <li><a href="#tools">Tools</a></li>
            <li><a href="#questions">Questions</a></li>
            <li><a href="#community">Community</a></li>
          </ul>

          {/* Right Side Buttons */}
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

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>

        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>

          <a href="#examples" onClick={closeMobileMenu}>Examples</a>
          <a href="#tools" onClick={closeMobileMenu}>Tools</a>
          <a href="#questions" onClick={closeMobileMenu}>Questions</a>
          <a href="#community" onClick={closeMobileMenu}>Community</a>

          {isLoggedIn ? (
            <>
              <Link to="/generator" onClick={closeMobileMenu}>
                Launch Studio
              </Link>

              <button onClick={logout} className="mobile-logout">
                Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth">
              <Link to="/login" onClick={closeMobileMenu} className="login-btn">
                Login
              </Link>

              <Link to="/register" onClick={closeMobileMenu} className="register-btn">
                Register
              </Link>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;
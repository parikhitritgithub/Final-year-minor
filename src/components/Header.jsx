import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </Link>
          
          <ul className="nav-links">
            <li><a href="#examples" onClick={closeMobileMenu}>Examples</a></li>
            <li><a href="#tools" onClick={closeMobileMenu}>Tools</a></li>
            <li><a href="#questions" onClick={closeMobileMenu}>Questions</a></li>
            <li><a href="#community" onClick={closeMobileMenu}>Community</a></li>
          </ul>
          
          <Link to="/generator" className="launch-btn">
            Launch Studio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="mobile-menu-btn"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <a href="#examples" onClick={closeMobileMenu}>Examples</a>
          <a href="#tools" onClick={closeMobileMenu}>Tools</a>
          <a href="#questions" onClick={closeMobileMenu}>Questions</a>
          <a href="#community" onClick={closeMobileMenu}>Community</a>
          <Link to="/generator" onClick={closeMobileMenu} className="mobile-launch-btn">
            Launch Studio
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
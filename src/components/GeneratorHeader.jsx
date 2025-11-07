import React from 'react'
import { Link } from 'react-router-dom'
import './GeneratorHeader.css'

function GeneratorHeader() {
  return (
    <header className="generator-header">
      <div className="container">
        <nav className="generator-nav">
          <Link to="/" className="logo-small">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>AI 3D Studio</span>
          </Link>
          
          <h1 className="page-title">Text to 3D Generator</h1>
          
          <Link to="/" className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12H5M12 19L5 12L12 5"/>
            </svg>
            Back to Home
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default GeneratorHeader

import React from 'react'
import { Link } from 'react-router-dom'
import './GeneratorHeader.css'

function GeneratorHeader({ title = "Text to 3D Generator" }) {
  return (
    <header className="generator-header">
      <div className="container">
        <nav className="generator-nav">
          <Link to="/" className="logo-small">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>AI 3D Studio</span>
          </Link>

          <h1 className="page-title">{title}</h1>

         <Link
             to={title === "Image to 3D Generator" ? "/generator" : "/image-to-3d"}
            className="px-5 py-2 rounded-lg text-white text-sm font-semibold
             bg-linear-to-r from-purple-600 to-pink-500
             shadow-lg shadow-purple-500/40
             hover:shadow-purple-500/70
             hover:scale-105
             transition-all duration-300"
            >
           {title === "Image to 3D Generator" ? "Try Text To 3D" : "Try Image To 3D"}
          </Link>

          <Link to="/history" className="back-btn">
            History
          </Link>

          <Link to="/" className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 12H5M12 19L5 12L12 5" />
            </svg>
            Back to Home
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default GeneratorHeader

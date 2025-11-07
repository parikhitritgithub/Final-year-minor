import React from 'react'
import { Link } from 'react-router-dom'
import './GeneratorFooter.css'

function GeneratorFooter() {
  return (
    <footer className="generator-footer">
      <div className="container">
        <div className="footer-content">
          <p>Generated with AI 3D Generator. All rights reserved.</p>
          <Link to="/" className="footer-link">Return to Landing Page</Link>
        </div>
      </div>
    </footer>
  )
}

export default GeneratorFooter

import React from 'react'
import { Link } from 'react-router-dom'
import './HeroSection.css'

function HeroSection() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Create Stunning 3D<br />
              Models with AI
            </h1>
            <p className="hero-description">
              Generate 3D models, animations and textures in seconds.<br />
              Drastically Reduce Time & Expense on 3D Models!
            </p>
            <div className="hero-buttons">
              <Link to="/generator" className="btn-primary">
                Get started - It's magic
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                </svg>
              </Link>
              <button className="btn-secondary">
                Demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18L15 12L9 6V18Z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="demo-card">
              <div className="demo-header">
                <span className="demo-label">TEXT OR 3D MODEL</span>
              </div>
              <div className="demo-prompt">
                "A CUTE WIZARD GIRL WITH A<br />
                BLUE AND WHITE OUTFIT"
              </div>
              <div className="demo-model">
                <img 
                  src="../assets/Screenshot 2025-11-07 155317-Picsart-AiImageEnhancer.png"
                  alt="3D wizard character model"
                  width="975"
                  height="650"
                />
              </div>
              <div className="demo-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.025 1L23 12L13.025 23L11.5 21.4L19.55 12L11.5 2.6L13.025 1Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
import React from 'react'
import './TestimonialSection.css'

function TestimonialSection() {
  return (
    <section className="testimonial">
      <div className="container">
        <div className="testimonial-content">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
              </svg>
            ))}
          </div>
          <blockquote className="testimonial-text">
            "It has truly been a game-changer for me!"
          </blockquote>
          <div className="testimonial-author">
            <div className="author-avatar">
              <img 
                src="https://images.pexels.com/photos/8390901/pexels-photo-8390901.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Noah Bohringer"
                width="40"
                height="40"
              />
            </div>
            <div className="author-info">
              <div className="author-name">Noah Bohringer</div>
              <div className="author-title">Game Developer at BHR Studios</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSection

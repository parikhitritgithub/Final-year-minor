import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import HeroSection from './HeroSection'
import TestimonialSection from './TestimonialSection'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <HeroSection />
        <TestimonialSection />
      </main>
    </div>
  )
}

export default LandingPage

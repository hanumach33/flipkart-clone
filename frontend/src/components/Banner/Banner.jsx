import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Banner.css'

const SLIDES = [
  {
    id: 1,
    bg: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #2874f0 100%)',
    title: '🔥 Biggest Electronics Sale',
    subtitle: 'Up to 70% off on Mobiles, Laptops & More',
    cta: 'Shop Electronics',
    link: '/products?category=Electronics',
  },
  {
    id: 2,
    bg: 'linear-gradient(135deg, #880e4f 0%, #c2185b 50%, #e91e63 100%)',
    title: '👗 Fashion Week Sale',
    subtitle: 'Min 50% off on Top Brands — Limited Time',
    cta: 'Shop Fashion',
    link: '/products?category=Fashion',
  },
  {
    id: 3,
    bg: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #43a047 100%)',
    title: '🏠 Home Makeover Deals',
    subtitle: 'Furniture & Decor starting ₹999',
    cta: 'Shop Home',
    link: '/products?category=Home',
  },
  {
    id: 4,
    bg: 'linear-gradient(135deg, #e65100 0%, #f57c00 50%, #ff9800 100%)',
    title: '⚡ Flash Sale — 24 Hours Only',
    subtitle: 'Extra 20% bank discount on all orders above ₹1999',
    cta: 'Grab Deals',
    link: '/products',
  },
  {
    id: 5,
    bg: 'linear-gradient(135deg, #311b92 0%, #4527a0 50%, #7e57c2 100%)',
    title: '📱 New Arrivals',
    subtitle: 'Latest Smartphones & Gadgets — Just Landed',
    cta: 'Explore New',
    link: '/products?sort=newest',
  },
]

const Banner = () => {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length)
  }, [])

  const prev = () => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)
  }

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="banner">
      <div
        className="banner-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="banner-slide"
            style={{ background: slide.bg }}
          >
            <div className="banner-slide-content">
              <h2 className="banner-slide-title">{slide.title}</h2>
              <p className="banner-slide-subtitle">{slide.subtitle}</p>
              <button
                className="banner-slide-btn"
                onClick={() => navigate(slide.link)}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Arrows ── */}
      <button className="banner-arrow banner-arrow-left" onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className="banner-arrow banner-arrow-right" onClick={next} aria-label="Next slide">
        ›
      </button>

      {/* ── Dots ── */}
      <div className="banner-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`banner-dot${idx === current ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Banner

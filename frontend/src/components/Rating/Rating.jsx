import React from 'react'
import './Rating.css'

/**
 * Rating component — renders filled / half / empty stars
 * @param {number} value  - rating value (0–5)
 * @param {number} count  - number of ratings (optional)
 * @param {boolean} showCount - whether to show the count
 */
const Rating = ({ value = 0, count = 0, showCount = true, size = 14 }) => {
  const stars = [1, 2, 3, 4, 5]

  const getStar = (star) => {
    if (value >= star) return 'filled'
    if (value >= star - 0.5) return 'half'
    return 'empty'
  }

  const formatCount = (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return n
  }

  return (
    <div className="rating" style={{ fontSize: size }}>
      <div className="rating-stars">
        {stars.map((star) => {
          const type = getStar(star)
          return (
            <span key={star} className={`rating-star rating-star--${type}`}>
              {type === 'filled' ? '★' : type === 'half' ? '⯨' : '☆'}
            </span>
          )
        })}
      </div>
      {showCount && count > 0 && (
        <span className="rating-count">({formatCount(count)})</span>
      )}
    </div>
  )
}

export default Rating

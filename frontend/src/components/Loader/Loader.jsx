import React from 'react'
import './Loader.css'

const Loader = ({ size = 40, fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div
          className="loader-spinner"
          style={{ width: size, height: size }}
        />
      </div>
    )
  }

  return (
    <div className="loader-wrapper">
      <div
        className="loader-spinner"
        style={{ width: size, height: size }}
      />
    </div>
  )
}

export default Loader

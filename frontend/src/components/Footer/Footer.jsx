import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-top-inner">
          {/* Column 1: About */}
          <div className="footer-col">
            <h3>About</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/corporate">Corporate Information</Link></li>
              <li><Link to="/flipkart-stories">Flipkart Stories</Link></li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div className="footer-col">
            <h3>Help</h3>
            <ul>
              <li><Link to="/payments">Payments</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/cancellation">Cancellation &amp; Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/report">Report Infringement</Link></li>
            </ul>
          </div>

          {/* Column 3: Consumer Policy */}
          <div className="footer-col">
            <h3>Consumer Policy</h3>
            <ul>
              <li><Link to="/returns">Return Policy</Link></li>
              <li><Link to="/terms">Terms Of Use</Link></li>
              <li><Link to="/security">Security</Link></li>
              <li><Link to="/privacy">Privacy</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
              <li><Link to="/epr">EPR Compliance</Link></li>
            </ul>
          </div>

          {/* Column 4: Social */}
          <div className="footer-col">
            <h3>Social</h3>
            <div className="footer-social">
              <a
                href="https://facebook.com"
                className="footer-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                📘
              </a>
              <a
                href="https://twitter.com"
                className="footer-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                🐦
              </a>
              <a
                href="https://instagram.com"
                className="footer-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                📷
              </a>
              <a
                href="https://youtube.com"
                className="footer-social-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                ▶️
              </a>
            </div>
            <div style={{ marginTop: '16px' }}>
              <h3 style={{ marginBottom: '12px' }}>Mail Us</h3>
              <p style={{ fontSize: '12px', color: '#cdcdcd', lineHeight: '1.8' }}>
                Flipkart Internet Private Limited,<br />
                Buildings Alyssa, Begonia &amp; Clover, Embassy Tech Village,<br />
                Outer Ring Road, Devarabeesanahalli Village,<br />
                Bengaluru, 560103, Karnataka, India
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <p className="footer-copyright">
            © 2024 Flipkart Clone. All rights reserved.
          </p>
        </div>
        <div className="footer-payments">
          <span>Payment Methods:</span>
          {['Visa', 'Mastercard', 'UPI', 'NetBanking', 'EMI', 'COD'].map((method) => (
            <span key={method} className="footer-payment-badge">{method}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer

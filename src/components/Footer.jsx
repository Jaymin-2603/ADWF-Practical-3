import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ name, email }) {
  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <div className="container">
        <p className="eyebrow">Stay in touch</p>
        <div className="footer-main">
          <div>
            <h2 id="footer-title">Have an idea?<br /><em>Let&apos;s connect.</em></h2>
            <p>I&apos;m always glad to learn from a new conversation.</p>
          </div>
          <Link className="footer-email" to="/contact">Visit the contact page <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Built with React, React Router & Vite for AWDF Practical 3</span>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>
    </footer>
  );
}

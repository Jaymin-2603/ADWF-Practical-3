import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ name, themeColor }) {
  return (
    <header className="hero" id="home" style={{ '--theme-color': themeColor }}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" /> Student developer · Open to learning</p>
          <h1>Hi, I&apos;m <span>{name}</span>.</h1>
          <p className="hero-lede">I build clean, thoughtful experiences for the web.</p>
          <p className="hero-detail">A student portfolio exploring modern frontend development, one component at a time.</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/projects">Explore projects <span aria-hidden="true">↗</span></Link>
            <Link className="button button-secondary" to="/contact">Get in touch <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-outer" />
          <div className="orbit orbit-inner" />
          <div className="art-card">
            <span className="art-bracket">&lt;</span>
            <span className="art-initials">JM</span>
            <span className="art-bracket">/&gt;</span>
          </div>
          <span className="art-spark art-spark-one">✳</span>
          <span className="art-spark art-spark-two">✦</span>
        </div>
      </div>
      <div className="container hero-bottom"><span>Scroll to explore</span><span aria-hidden="true">↓</span></div>
    </header>
  );
}

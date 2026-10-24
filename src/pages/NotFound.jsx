import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section not-found-page" aria-labelledby="not-found-title">
      <div className="container">
        <p className="eyebrow">404 / Page not found</p>
        <h1 id="not-found-title">This page took a different route.</h1>
        <p>The address may have changed. Head back to the portfolio home page.</p>
        <Link className="button not-found-link" to="/">Back to home <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}

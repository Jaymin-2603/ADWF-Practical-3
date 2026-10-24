import React from 'react';

export default function About() {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container section-grid">
        <div className="section-intro">
          <p className="eyebrow">01 / About</p>
          <h2 id="about-title">Curious by nature.<br /><em>Builder by practice.</em></h2>
        </div>
        <div className="section-body">
          <p>I&apos;m a student developer learning how to turn ideas into useful, accessible websites. I enjoy the mix of problem-solving and visual detail that frontend work brings.</p>
          <p>This portfolio is an exercise in React component architecture: small pieces with clear responsibilities, composed into one coherent page.</p>
          <a className="text-link" href="#skills">See what I&apos;m learning <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

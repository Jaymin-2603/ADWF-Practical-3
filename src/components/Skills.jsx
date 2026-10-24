import React from 'react';

export default function Skills({ skillList }) {
  return (
    <section className="section skills-section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">02 / Skills</p>
            <h2 id="skills-title">Tools I&apos;m growing with<span className="accent-period">.</span></h2>
          </div>
          <p>A working toolkit, always expanding.</p>
        </div>
        {skillList.length > 0 ? (
          <ul className="skill-list">
            {skillList.map((skill, index) => (
              <li key={skill}>
                <span className="skill-number">{String(index + 1).padStart(2, '0')}</span>
                <span>{skill}</span>
                <span className="skill-arrow" aria-hidden="true">↗</span>
              </li>
            ))}
          </ul>
        ) : <p className="empty-state">New skills are on the way.</p>}
      </div>
    </section>
  );
}

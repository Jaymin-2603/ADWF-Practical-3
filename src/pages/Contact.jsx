import React, { useState } from 'react';

export default function Contact({ email }) {
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const subject = encodeURIComponent(`Portfolio message from ${visitorName.trim() || 'a visitor'}`);
  const body = encodeURIComponent(message);
  const emailLink = `mailto:${email}?subject=${subject}&body=${body}`;

  function handleSubmit(event) {
    event.preventDefault();
    window.location.href = emailLink;
  }

  return (
    <section className="section contact-page" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-intro">
          <p className="eyebrow">04 / Contact</p>
          <h1 id="contact-title">Have an idea?<br /><em>Let&apos;s connect.</em></h1>
          <p>Write a note and see it update instantly. When you&apos;re ready, open it in your email app.</p>
          <a className="contact-direct-link" href={`mailto:${email}`}>{email} <span aria-hidden="true">↗</span></a>
        </div>

        <div className="contact-panel">
          <div className="contact-panel-heading">
            <h2>Write a message</h2>
            <button type="button" className="help-toggle" aria-expanded={showHelp} aria-controls="contact-help" onClick={() => setShowHelp((visible) => !visible)}>
              {showHelp ? 'Hide tips' : 'Show tips'}
            </button>
          </div>
          <p id="contact-help" className="contact-help" hidden={!showHelp}>Share a short introduction and what you would like to discuss. Your message stays in this browser until you open your email app.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="contact-name">Your name</label>
            <input id="contact-name" name="name" type="text" value={visitorName} onChange={(event) => setVisitorName(event.target.value)} placeholder="Your name" autoComplete="name" maxLength={80} />

            <label htmlFor="contact-message">Your message</label>
            <textarea id="contact-message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like to talk about?" maxLength={280} rows={5} required />
            <p className="character-count" aria-live="polite">{message.length} / 280 characters</p>

            <button className="button contact-submit" type="submit">Open email app <span aria-hidden="true">↗</span></button>
          </form>

          <div className="message-preview" aria-live="polite">
            <span className="preview-label">Live preview</span>
            <p className="preview-from">From {visitorName.trim() || 'you'}</p>
            <p className="preview-message">{message || 'Your message will appear here as you type.'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

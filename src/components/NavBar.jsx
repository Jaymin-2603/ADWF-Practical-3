import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function NavBar({ isDark, onToggleTheme }) {
  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="container nav-inner">
        <Link className="brand" to="/" aria-label="JM. — Jaymin Mandaliya, back to home">
          JM<span>.</span>
        </Link>
        <div className="nav-links">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>{label}</NavLink>
          ))}
        </div>
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          aria-pressed={isDark}
        >
          <span aria-hidden="true">{isDark ? '☀' : '☾'}</span>
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
}

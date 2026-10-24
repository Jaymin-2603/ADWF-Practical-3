import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let Header;
let Skills;
let Projects;
let Footer;
let NavBar;
let App;

function renderAt(path, Component, props = {}) {
  return renderToStaticMarkup(
    createElement(MemoryRouter, { initialEntries: [path] }, createElement(Component, props)),
  );
}

before(async () => {
  vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true }, appType: 'custom' });
  [Header, Skills, Projects, Footer, NavBar, App] = await Promise.all([
    './src/components/Header.jsx',
    './src/components/Skills.jsx',
    './src/components/Projects.jsx',
    './src/components/Footer.jsx',
    './src/components/NavBar.jsx',
    './src/App.jsx',
  ].map(async (path) => (await vite.ssrLoadModule(path)).default));
});

after(async () => {
  await vite?.close();
});

test('AC1: each practical 2 route renders its own main content', () => {
  const home = renderAt('/', App);
  const projects = renderAt('/projects', App);
  const contact = renderAt('/contact', App);

  assert.match(home, /Hi, I&#x27;m/);
  assert.match(home, /Tools I&#x27;m growing with/);
  assert.doesNotMatch(home, /class="project-card"/);
  assert.match(projects, /Selected projects/);
  assert.equal((projects.match(/class="project-card"/g) ?? []).length, 5);
  assert.doesNotMatch(projects, /Hi, I&#x27;m/);
  assert.match(contact, /Write a message/);
  assert.match(contact, /contact-message/);
  assert.doesNotMatch(contact, /class="project-card"/);
});

test('AC2: Header renders changed props and applies its color as an inline style', () => {
  const html = renderAt('/', Header, { name: 'Alex', themeColor: '#123abc' });
  assert.match(html, /Alex/);
  assert.match(html, /style="--theme-color:#123abc"/);
  assert.doesNotMatch(html, /Jaymin Mandaliya/);
});

test('AC2 security: React escapes a name containing markup', () => {
  const html = renderAt('/', Header, { name: '<script>alert(1)</script>', themeColor: '#123abc' });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

test('AC3: Skills renders the list supplied by its parent', () => {
  const html = renderToStaticMarkup(createElement(Skills, { skillList: ['React', 'CSS', 'Git'] }));
  assert.equal((html.match(/<li\b/g) ?? []).length, 3);
  for (const skill of ['React', 'CSS', 'Git']) assert.match(html, new RegExp(skill));
});

test('AC3 boundary: Skills gives an empty-list message', () => {
  const html = renderToStaticMarkup(createElement(Skills, { skillList: [] }));
  assert.equal((html.match(/<li\b/g) ?? []).length, 0);
  assert.match(html, /New skills are on the way/);
});

test('AC3 property: any generated list size renders exactly that many skills', () => {
  for (let size = 1; size <= 40; size += 1) {
    const skillList = Array.from({ length: size }, (_, index) => `Skill-${size}-${index}`);
    const html = renderToStaticMarkup(createElement(Skills, { skillList }));
    assert.equal((html.match(/<li\b/g) ?? []).length, size, `list length ${size}`);
    for (const skill of skillList) assert.ok(html.includes(skill), `missing ${skill}`);
  }
});

test('AC4: Projects displays the five repositories supplied for the portfolio', () => {
  const html = renderToStaticMarkup(createElement(Projects));
  assert.equal((html.match(/<article\b/g) ?? []).length, 5);
  for (const title of ['TNP Cell', 'Intern Intelligence Platform', 'AquaSenti', 'CrimeGPT', 'SIH 2026']) {
    assert.ok(html.includes(title));
  }
  for (const repository of [
    'https://github.com/Jaymin-2603/TNP-CELL',
    'https://github.com/Jaymin-2603/intern-dashboard',
    'https://github.com/Jaymin-2603/AquaSenti',
    'https://github.com/Priyanshu-Macwan/CrimeGPT',
    'https://github.com/Aryan-B-Parikh/SIH-2026',
  ]) {
    assert.ok(html.includes(repository), `missing ${repository}`);
  }
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer"/g) ?? []).length, 5);
  assert.doesNotMatch(html, /Task Board Concept|Weather Dashboard Concept/);
  assert.equal((html.match(/Private repository · GitHub access required/g) ?? []).length, 2);
});

test('AC5: navigation uses the three routes and marks the active route', () => {
  const html = renderAt('/projects', NavBar, { isDark: false, onToggleTheme: () => {} });
  for (const path of ['/', '/projects', '/contact']) assert.ok(html.includes(`href="${path}"`));
  assert.match(html, /aria-current="page"[^>]*href="\/projects"/);
  assert.match(html, /Switch to dark mode/);
});

test('AC6: Footer contact link follows the email prop', () => {
  const html = renderAt('/', Footer, { name: 'Alex', email: 'alex@example.com' });
  assert.match(html, /mailto:alex@example\.com/);
  assert.match(html, /Alex/);
});

test('AC7: contact form has controlled fields, a live preview, and hidden help initially', () => {
  const html = renderAt('/contact', App);
  assert.match(html, /id="contact-name"[^>]*value=""/);
  assert.match(html, /id="contact-message"[^>]*required=""/);
  assert.match(html, /0 \/ 280 characters/);
  assert.match(html, /Your message will appear here as you type/);
  assert.match(html, /id="contact-help"[^>]*hidden=""/);
});

test('AC8: an unknown URL renders the custom 404 and a home link', () => {
  const html = renderAt('/missing-page', App);
  assert.match(html, /This page took a different route/);
  assert.match(html, /Back to home/);
  assert.doesNotMatch(html, /Write a message/);
});

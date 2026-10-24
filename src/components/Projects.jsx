import React, { useEffect, useState } from 'react';
import { filterRepositories, loadGitHubRepositories } from '../lib/githubRepos.js';

const projects = [
  {
    number: '01',
    title: 'TNP Cell',
    description: 'A React and FastAPI placement portal for student activity, companies, sessions, and reports.',
    category: 'Full-stack portal',
    mark: 'TC',
    repository: 'https://github.com/Jaymin-2603/TNP-CELL',
    accessNote: 'Private repository · GitHub access required.',
  },
  {
    number: '02',
    title: 'Intern Intelligence Platform',
    description: 'Mentor and intern analytics with ETL-backed reporting and an AI data assistant.',
    category: 'Data & AI',
    mark: 'II',
    repository: 'https://github.com/Jaymin-2603/intern-dashboard',
  },
  {
    number: '03',
    title: 'AquaSenti',
    description: 'An interactive flood digital twin for scenario-based inundation and infrastructure risk.',
    category: 'Flood digital twin',
    mark: 'AS',
    repository: 'https://github.com/Jaymin-2603/AquaSenti',
    accessNote: 'Private repository · GitHub access required.',
  },
  {
    number: '04',
    title: 'CrimeGPT',
    description: 'Case and evidence management with FIR drafting, approvals, and audit history.',
    category: 'Civic tech',
    mark: 'CG',
    repository: 'https://github.com/Priyanshu-Macwan/CrimeGPT',
  },
  {
    number: '05',
    title: 'SIH 2026 · AquaSenti Digital Twin',
    description: 'An end-to-end rainfall early-warning platform with AI nowcasts and impact-based alerts.',
    category: 'Smart India Hackathon',
    mark: 'DT',
    repository: 'https://github.com/Aryan-B-Parikh/SIH-2026',
  },
];

function Spinner() {
  return <div className="repo-status" role="status"><span className="repo-spinner" aria-hidden="true" />Loading public repositories from GitHub…</div>;
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="repo-status repo-error" role="alert">
      <div>
        <strong>Repositories could not be loaded.</strong>
        <p>{message}</p>
      </div>
      <button className="repo-retry" type="button" onClick={onRetry}>Try again</button>
    </div>
  );
}

function RepoList({ repositories }) {
  if (repositories.length === 0) {
    return <p className="repo-empty">No repositories match this search.</p>;
  }

  return (
    <div className="github-repo-grid">
      {repositories.map((repo) => (
        <article className="github-repo-card" key={repo.url}>
          <div className="github-repo-heading">
            <h3>{repo.name}</h3>
            <span className="repo-stars" aria-label={`${repo.stars} stars`}>★ {repo.stars}</span>
          </div>
          {repo.description && <p>{repo.description}</p>}
          <a href={repo.url} target="_blank" rel="noopener noreferrer">{repo.url} <span aria-hidden="true">↗</span></a>
        </article>
      ))}
    </div>
  );
}

export default function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    loadGitHubRepositories({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setRepos(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(cause.message || 'A network error occurred. Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const visibleRepos = filterRepositories(repos, search);

  return (
    <section className="section projects-section" id="projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / Projects</p>
            <h2 id="projects-title">Selected projects<span className="accent-period">.</span></h2>
          </div>
          <p>Five projects and team collaborations on GitHub.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.number}>
              <div className="project-visual" aria-hidden="true"><span>{project.mark}</span></div>
              <div className="project-meta"><span>{project.number} / {project.category}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a className="project-link" href={project.repository} target="_blank" rel="noopener noreferrer" aria-label={`View repository for ${project.title} on GitHub`}>
                View repository <span aria-hidden="true">↗</span>
              </a>
              {project.accessNote && <p className="repo-access-note">{project.accessNote}</p>}
            </article>
          ))}
        </div>

        <div className="github-repos" aria-labelledby="github-repos-title">
          <div className="section-heading github-repos-heading">
            <div>
              <p className="eyebrow">Live GitHub API</p>
              <h2 id="github-repos-title">Public repositories<span className="accent-period">.</span></h2>
            </div>
            <p>Fetched from Jaymin-2603 when this page opens.</p>
          </div>
          <div className="repo-search-row">
            <label htmlFor="repo-search">Search repositories by name</label>
            <input id="repo-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name" />
          </div>
          {loading ? <Spinner /> : error ? <ErrorMessage message={error} onRetry={() => setAttempt((value) => value + 1)} /> : (
            <>
              <p className="repo-count" aria-live="polite">Showing {visibleRepos.length} of {repos.length} public repositories</p>
              <RepoList repositories={visibleRepos} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

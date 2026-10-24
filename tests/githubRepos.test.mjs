import test from 'node:test';
import assert from 'node:assert/strict';
import { GITHUB_REPOS_URL, filterRepositories, loadGitHubRepositories } from '../src/lib/githubRepos.js';

const repository = (name, stars = 0) => ({
  name,
  html_url: `https://github.com/Jaymin-2603/${name}`,
  stargazers_count: stars,
  description: `${name} description`,
});

const response = (data, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
});

test('AC1 happy path: requests the public GitHub endpoint and returns names, URLs, and stars', async () => {
  const signal = new AbortController().signal;
  let request;
  const repos = await loadGitHubRepositories({
    signal,
    fetchImpl: async (url, options) => {
      request = { url, options };
      return response([repository('alpha', 7), repository('beta', 0)]);
    },
  });

  assert.equal(request.url, GITHUB_REPOS_URL);
  assert.match(request.url, /^https:\/\/api\.github\.com\/users\/Jaymin-2603\/repos/);
  assert.equal(request.options.signal, signal);
  assert.equal(request.options.headers.Accept, 'application/vnd.github+json');
  assert.deepEqual(repos.map(({ name, url, stars }) => ({ name, url, stars })), [
    { name: 'alpha', url: 'https://github.com/Jaymin-2603/alpha', stars: 7 },
    { name: 'beta', url: 'https://github.com/Jaymin-2603/beta', stars: 0 },
  ]);
});

test('AC1 boundary: an empty GitHub array is an empty success, not an error', async () => {
  const repos = await loadGitHubRepositories({ fetchImpl: async () => response([]) });
  assert.deepEqual(repos, []);
});

test('AC2 error: rate limiting produces a useful message', async () => {
  await assert.rejects(
    loadGitHubRepositories({ fetchImpl: async () => response(null, 403) }),
    /temporarily limiting requests/,
  );
});

test('AC2 error: a server failure is not treated as an empty list', async () => {
  await assert.rejects(
    loadGitHubRepositories({ fetchImpl: async () => response(null, 500) }),
    /request failed \(500\)/,
  );
});

test('AC2 malformed data: a successful response must contain an array', async () => {
  await assert.rejects(
    loadGitHubRepositories({ fetchImpl: async () => response({ message: 'unexpected' }) }),
    /unexpected response/,
  );
});

test('AC1 security: an unsafe repository URL cannot become a rendered link', async () => {
  await assert.rejects(
    loadGitHubRepositories({ fetchImpl: async () => response([{ ...repository('bad'), html_url: 'javascript:alert(1)' }]) }),
    /invalid repository URL/,
  );
});

test('AC3 input: search ignores surrounding whitespace and letter case', () => {
  const repos = [{ name: 'React-Portfolio' }, { name: 'FastAPI' }, { name: 'react-notes' }];
  assert.deepEqual(filterRepositories(repos, '  REACT  ').map(({ name }) => name), ['React-Portfolio', 'react-notes']);
  assert.equal(filterRepositories(repos, '   '), repos);
});

test('AC3 property: generated names are filtered by literal substring without changing order', () => {
  for (let size = 1; size <= 60; size += 1) {
    const repos = Array.from({ length: size }, (_, index) => ({ name: `${index % 2 ? 'other' : 'TEAM'}-${index}` }));
    const matched = filterRepositories(repos, 'team');
    assert.deepEqual(matched.map(({ name }) => name), repos.filter((_, index) => index % 2 === 0).map(({ name }) => name));
    assert.deepEqual(filterRepositories(repos, '['), []);
  }
});

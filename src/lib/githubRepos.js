export const GITHUB_REPOS_URL = 'https://api.github.com/users/Jaymin-2603/repos?per_page=100&sort=updated';

export async function loadGitHubRepositories({ fetchImpl = fetch, signal } = {}) {
  const response = await fetchImpl(GITHUB_REPOS_URL, {
    headers: { Accept: 'application/vnd.github+json' },
    signal,
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error('GitHub is temporarily limiting requests. Please try again shortly.');
    }
    throw new Error(`GitHub request failed (${response.status}). Please try again.`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('GitHub returned an unexpected response. Please try again.');
  }

  return data.map((repo) => {
    if (!repo || typeof repo.name !== 'string' || !repo.name.trim() || typeof repo.html_url !== 'string') {
      throw new Error('GitHub returned an invalid repository. Please try again.');
    }

    let url;
    try {
      url = new URL(repo.html_url);
    } catch {
      throw new Error('GitHub returned an invalid repository URL. Please try again.');
    }
    if (url.protocol !== 'https:' || url.hostname !== 'github.com') {
      throw new Error('GitHub returned an invalid repository URL. Please try again.');
    }

    return {
      name: repo.name,
      url: url.href,
      stars: Number.isInteger(repo.stargazers_count) && repo.stargazers_count >= 0 ? repo.stargazers_count : 0,
      description: typeof repo.description === 'string' ? repo.description : '',
    };
  });
}

export function filterRepositories(repositories, query) {
  const term = query.trim().toLowerCase();
  return term ? repositories.filter((repo) => repo.name.toLowerCase().includes(term)) : repositories;
}

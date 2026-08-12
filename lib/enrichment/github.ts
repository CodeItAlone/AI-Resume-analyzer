export interface GitHubRepoSummary {
  name: string;
  description?: string;
  languages: string[];
  stars?: number;
  updatedAt?: string;
}

export async function fetchGitHubPublicEvidence(githubUrl?: string): Promise<GitHubRepoSummary[]> {
  if (!githubUrl || !githubUrl.includes('github.com')) {
    return [];
  }

  try {
    const match = githubUrl.match(/github\.com\/([a-zA-Z0-9_-]+)/);
    const username = match ? match[1] : null;

    if (!username) return [];

    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`, {
      headers: {
        'User-Agent': 'AI-Resume-Analyzer',
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) return [];

    const repos = await res.json();
    if (!Array.isArray(repos)) return [];

    return repos.map((r: any) => ({
      name: r.name,
      description: r.description || '',
      languages: r.language ? [r.language] : [],
      stars: r.stargazers_count || 0,
      updatedAt: r.updated_at,
    }));
  } catch (err) {
    console.warn('GitHub public evidence fetch skipped:', err);
    return [];
  }
}

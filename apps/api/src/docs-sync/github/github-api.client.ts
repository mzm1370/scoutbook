export type GithubRepoRef = {
  owner: string;
  repo: string;
};

export type GithubCommitFile = {
  path: string;
  content: string;
};

export type GithubSyncResult = {
  prUrl: string;
  branch: string;
  filesWritten: number;
};

export const GITHUB_API_CLIENT = Symbol('GITHUB_API_CLIENT');

export interface GithubApiClient {
  openDocsPr(input: {
    token: string;
    repo: GithubRepoRef;
    branch: string;
    files: GithubCommitFile[];
    commitMessage: string;
    prTitle: string;
    prBody: string;
  }): Promise<GithubSyncResult>;
}

export function parseGithubRepoUrl(repoUrl: string): GithubRepoRef {
  const trimmed = repoUrl.trim().replace(/\.git$/i, '');
  const https = trimmed.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/i,
  );
  if (https?.[1] && https[2]) {
    return { owner: https[1], repo: https[2] };
  }
  const short = trimmed.match(/^([^/]+)\/([^/]+)$/);
  if (short?.[1] && short[2]) {
    return { owner: short[1], repo: short[2] };
  }
  throw new Error(
    'repoUrl must be https://github.com/owner/repo or owner/repo',
  );
}

export function normalizeGithubRepoUrl(repoUrl: string): string {
  const { owner, repo } = parseGithubRepoUrl(repoUrl);
  return `https://github.com/${owner}/${repo}`;
}

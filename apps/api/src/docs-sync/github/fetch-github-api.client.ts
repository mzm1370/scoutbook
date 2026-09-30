import { Injectable } from '@nestjs/common';
import type {
  GithubApiClient,
  GithubCommitFile,
  GithubRepoRef,
  GithubSyncResult,
} from '@api/docs-sync/github/github-api.client.js';

type GhJson = Record<string, unknown>;

@Injectable()
export class FetchGithubApiClient implements GithubApiClient {
  async openDocsPr(input: {
    token: string;
    repo: GithubRepoRef;
    branch: string;
    files: GithubCommitFile[];
    commitMessage: string;
    prTitle: string;
    prBody: string;
  }): Promise<GithubSyncResult> {
    const { token, repo, branch, files, commitMessage, prTitle, prBody } =
      input;
    const base = `https://api.github.com/repos/${repo.owner}/${repo.repo}`;
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'scoutbook-docs-sync',
    };

    const repoInfo = await this.getJson(`${base}`, headers);
    const defaultBranch =
      typeof repoInfo.default_branch === 'string'
        ? repoInfo.default_branch
        : 'main';

    const ref = await this.getJson(
      `${base}/git/ref/heads/${encodeURIComponent(defaultBranch)}`,
      headers,
    );
    const baseSha =
      typeof (ref.object as GhJson | undefined)?.sha === 'string'
        ? ((ref.object as GhJson).sha as string)
        : null;
    if (!baseSha) {
      throw new Error('Could not resolve default branch SHA');
    }

    await this.request(`${base}/git/refs`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha: baseSha,
      }),
    });

    for (const file of files) {
      await this.upsertFile({
        base,
        headers,
        branch,
        path: file.path,
        content: file.content,
        message: commitMessage,
      });
    }

    const pr = await this.postJson(`${base}/pulls`, headers, {
      title: prTitle,
      head: branch,
      base: defaultBranch,
      body: prBody,
    });
    const prUrl =
      typeof pr.html_url === 'string' ? pr.html_url : `${base}/pulls`;

    return {
      prUrl,
      branch,
      filesWritten: files.length,
    };
  }

  private async upsertFile(input: {
    base: string;
    headers: Record<string, string>;
    branch: string;
    path: string;
    content: string;
    message: string;
  }): Promise<void> {
    const { base, headers, branch, path, content, message } = input;
    let sha: string | undefined;
    try {
      const existing = await this.getJson(
        `${base}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`,
        headers,
      );
      if (typeof existing.sha === 'string') sha = existing.sha;
    } catch {
      // file does not exist yet
    }

    await this.request(
      `${base}/contents/${path.split('/').map(encodeURIComponent).join('/')}`,
      {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          content: Buffer.from(content, 'utf8').toString('base64'),
          branch,
          ...(sha ? { sha } : {}),
        }),
      },
    );
  }

  private async getJson(
    url: string,
    headers: Record<string, string>,
  ): Promise<GhJson> {
    const res = await this.request(url, { method: 'GET', headers });
    return (await res.json()) as GhJson;
  }

  private async postJson(
    url: string,
    headers: Record<string, string>,
    body: unknown,
  ): Promise<GhJson> {
    const res = await this.request(url, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return (await res.json()) as GhJson;
  }

  private async request(url: string, init: RequestInit): Promise<Response> {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub API ${res.status}: ${text.slice(0, 300)}`);
    }
    return res;
  }
}

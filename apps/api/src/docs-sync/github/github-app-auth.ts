import { createPrivateKey, createSign } from 'node:crypto';

/**
 * Create a short-lived GitHub App JWT (RS256) for installation token exchange.
 * @see https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-json-web-token-jwt-for-a-github-app
 */
export function createGithubAppJwt(
  appId: string,
  privateKeyPem: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iat: nowSeconds - 60,
    exp: nowSeconds + 9 * 60,
    iss: appId,
  };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const key = createPrivateKey(normalizePem(privateKeyPem));
  const signer = createSign('RSA-SHA256');
  signer.update(data);
  signer.end();
  const signature = signer.sign(key);
  return `${data}.${base64url(signature)}`;
}

export type InstallationTokenResponse = {
  token: string;
  expires_at: string;
};

export async function fetchInstallationAccessToken(params: {
  appId: string;
  installationId: string;
  privateKeyPem: string;
  fetchImpl?: typeof fetch;
}): Promise<string> {
  const fetchFn = params.fetchImpl ?? fetch;
  const jwt = createGithubAppJwt(params.appId, params.privateKeyPem);
  const url = `https://api.github.com/app/installations/${encodeURIComponent(params.installationId)}/access_tokens`;
  const res = await fetchFn(url, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${jwt}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'scoutbook-docs-sync',
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `GitHub App installation token failed (${res.status}): ${body.slice(0, 200)}`,
    );
  }
  const json = (await res.json()) as InstallationTokenResponse;
  if (!json.token) {
    throw new Error('GitHub App installation token response missing token');
  }
  return json.token;
}

function normalizePem(pem: string): string {
  const trimmed = pem.trim().replace(/\\n/g, '\n');
  if (!trimmed.includes('BEGIN')) {
    throw new Error('GitHub App private key must be a PEM string');
  }
  return trimmed;
}

function base64url(input: string | Buffer): string {
  const buf = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

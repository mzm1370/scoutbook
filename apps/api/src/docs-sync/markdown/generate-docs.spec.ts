import { describe, expect, it } from 'vitest';
import {
  featureSlug,
  generateDocsMarkdown,
  renderOverview,
} from '@api/docs-sync/markdown/generate-docs.js';

describe('generate-docs markdown', () => {
  it('builds stable slugs', () => {
    expect(featureSlug('Docs Sync!', 12)).toBe('docs-sync-12');
  });

  it('renders overview', () => {
    const md = renderOverview({
      id: 1,
      title: 'Auth',
      problem: 'Need login',
      currentStage: 'IDEA',
      riskTier: 'P2',
    });
    expect(md).toContain('# Auth');
    expect(md).toContain('Need login');
  });

  it('skips empty optional sections', () => {
    const files = generateDocsMarkdown(
      [
        {
          feature: {
            id: 3,
            title: 'Kanban',
            problem: 'Board view',
            currentStage: 'RFC',
            riskTier: 'P3',
          },
          scouting: [],
          rfcCheck: null,
          rfcDocument: null,
          raci: [],
        },
      ],
      [],
    );
    expect(files.map((f) => f.path)).toEqual([
      'docs/features/kanban-3/overview.md',
      'docs/scoutbook/feature-relations.md',
    ]);
  });
});

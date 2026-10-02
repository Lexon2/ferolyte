import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../../..',
);
const schemasCached =
  spawnSync(
    'node',
    [
      '-e',
      'process.exit(require("fs").existsSync(".cache/bedrock-schemas/source")?0:1)',
    ],
    { cwd: ROOT },
  ).status === 0;
const temp = mkdtempSync(path.join(tmpdir(), 'ferolyte-codegen-test-'));
afterAll(() => rmSync(temp, { recursive: true, force: true }));

const runCodegen = (patch: object) => {
  const extra = mkdtempSync(path.join(temp, 'patches-'));
  mkdirSync(path.join(extra, 'entity', 'components'), { recursive: true });
  writeFileSync(
    path.join(extra, 'entity', 'components', 'loose_test.json'),
    JSON.stringify({ 'x-new-component': 'minecraft:loose_test', ...patch }),
  );

  return spawnSync('node', ['scripts/schemas/codegen.mjs'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      CODEGEN_OUT: mkdtempSync(path.join(temp, 'out-')),
      CODEGEN_EXTRA_PATCHES: extra,
    },
  });
};

describe.skipIf(!schemasCached)(
  'codegen is fail-closed for loose schemas',
  // Each test runs the whole codegen in a child process.
  { timeout: 120_000 },
  () => {
    it('fails and lists a component whose schema has no properties', () => {
      const result = runCodegen({ type: 'object' });

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('minecraft:loose_test');
      expect(result.stderr).toContain('x-free-form');
    });

    it.each([
      [
        'x-free-form',
        { type: 'object', additionalProperties: {}, 'x-free-form': 'test' },
      ],
      [
        'a marker (additionalProperties: false)',
        { type: 'object', additionalProperties: false },
      ],
      [
        'a real schema',
        { type: 'object', properties: { a: { type: 'number' } } },
      ],
    ])('accepts %s', (_name, patch) => {
      expect(runCodegen(patch).status).toBe(0);
    });

    it('rejects x-removed without evidence or with a since the corpus does not prove', () => {
      const noEvidence = runCodegen({
        type: 'object',
        'x-removed': { since: '1.26.10' },
      });
      expect(noEvidence.status).not.toBe(0);
      expect(noEvidence.stderr).toContain('x-removed without x-evidence');

      const wrong = runCodegen({
        type: 'object',
        'x-removed': { since: '1.26.10' },
        'x-evidence': { replacements: ['minecraft:pushable_by_entity'] },
      });
      expect(wrong.status).not.toBe(0);
    });
  },
);

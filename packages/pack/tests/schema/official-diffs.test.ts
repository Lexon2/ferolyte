import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, '../../../..');
const officialAvailable = existsSync(
  path.join(ROOT, '.cache/bedrock-samples/metadata/json_schemas/server/entity'),
);
const ignored: Record<string, string> = JSON.parse(
  readFileSync(path.join(here, 'ignored-diffs.json'), 'utf8'),
);

describe.skipIf(!officialAvailable)(
  'official Mojang schemas vs the SDK',
  () => {
    // The scripts are plain ESM without types.
    const load = async () =>
      (await import(
        /* @vite-ignore */ path.join(
          ROOT,
          'scripts/schemas/classify-official.mjs',
        )
      )) as {
        classify: () => { area: string; component: string; field?: string }[];
        unresolved: (
          diffs: unknown[],
        ) => { area: string; component: string; field?: string }[];
        diffId: (d: unknown) => string;
      };

    it('every difference is fixed, marked (x-removed / x-deprecated) or ignored with a reason', async () => {
      const m = await load();
      const open = m
        .unresolved(m.classify())
        .map(m.diffId)
        .filter((id) => !ignored[id]);

      expect(open).toEqual([]);
    }, 60_000);

    it('ignored-diffs.json has no stale entries and every entry has a reason', async () => {
      const m = await load();
      const ids = new Set(m.unresolved(m.classify()).map(m.diffId));

      expect(Object.keys(ignored).filter((id) => !ids.has(id))).toEqual([]);
      expect(
        Object.entries(ignored).filter(([, reason]) => reason.length < 10),
      ).toEqual([]);
    }, 60_000);
  },
);

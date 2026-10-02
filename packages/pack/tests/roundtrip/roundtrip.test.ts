import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  CATEGORIES,
  Category,
  Failure,
  cachesAvailable,
  runRoundtrip,
} from './harness';

const here = path.dirname(fileURLToPath(import.meta.url));
const gapsFile = path.join(here, 'known-gaps.json');
const reasonsFile = path.join(here, 'known-gaps.reasons.json');

/** `area/component` → categories that are allowed to fail until T14b fixes them. */
const knownGaps: Record<string, Category[]> = existsSync(gapsFile)
  ? JSON.parse(readFileSync(gapsFile, 'utf8'))
  : {};

const reasons: Record<string, string> = existsSync(reasonsFile)
  ? JSON.parse(readFileSync(reasonsFile, 'utf8'))
  : {};

describe.skipIf(!cachesAvailable)('round-trip: vanilla + schema variants', () => {
  // The describe body is collected even when skipped: don't touch the caches without them.
  const result = cachesAvailable ? runRoundtrip() : { total: 0, failures: [] as Failure[] };

  const out = process.env.ROUNDTRIP_OUT;
  if (out !== undefined && out !== '') {
    mkdirSync(path.dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(result));
  }

  const byComponent = new Map<string, Failure[]>();
  for (const failure of result.failures) {
    const key = `${failure.area}/${failure.component}`;
    byComponent.set(key, [...(byComponent.get(key) ?? []), failure]);
  }

  it('exercises a meaningful number of instances', () => {
    expect(result.total).toBeGreaterThan(500);
  });

  for (const [key, failures] of byComponent) {
    it(`${key} (${failures.length} gap(s))`, () => {
      const found = new Set(failures.flatMap((f) => f.categories));
      const allowed = new Set(knownGaps[key] ?? []);
      const unexpected = CATEGORIES.filter(
        (category) => found.has(category) && !allowed.has(category),
      );

      expect(
        unexpected,
        `new gap(s); fix the SDK or add to known-gaps.json (npm run roundtrip -- --update-gaps)`,
      ).toEqual([]);
    });
  }

  it('every known gap has a reason', () => {
    expect(Object.keys(knownGaps).filter((key) => !reasons[key])).toEqual([]);
  });

  it('known-gaps.json has no stale entries', () => {
    const stale = Object.entries(knownGaps).filter(([key, categories]) => {
      const found = new Set(
        (byComponent.get(key) ?? []).flatMap((f) => f.categories),
      );

      return categories.some((category) => !found.has(category));
    });

    expect(stale.map(([key]) => key)).toEqual([]);
  });
});

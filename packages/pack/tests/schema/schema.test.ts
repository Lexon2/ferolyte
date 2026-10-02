import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterAll, describe, expect, it } from 'vitest';

import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { ItemBuilder } from '@ferolyte/pack/content/item/item-builder';
import { ServerEntityBuilder } from '@ferolyte/pack/content/server-entity/server-entity-builder';

import { schemasAvailable, validateAgainst } from '../helpers/schema';

type FixtureKind = 'entity' | 'entity_behavior' | 'item' | 'block';

interface Fixture {
  kind: FixtureKind;
  component: string;
  config: unknown;
}

interface Result {
  kind: FixtureKind;
  component: string;
  outputKeys: string[];
  errors: { path: string; message: string }[];
  buildError?: string;
}

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(here, 'fixtures');

const knownFailures: Record<string, string[]> = (() => {
  try {
    return JSON.parse(
      readFileSync(path.join(here, 'known-failures.json'), 'utf8'),
    );
  } catch {
    return {};
  }
})();

// Kept in the SDK (deprecated, with a diagnostic warning) but absent from the
// Bedrock schemas (removed or unknown upstream), so they can never validate.
const notInSchema: Partial<Record<FixtureKind, string[]>> = {
  entity: ['scaffoldingClimber'],
  entity_behavior: [
    'endermanLeaveBlock',
    'endermanTakeBlock',
    'followTargetCaptain',
  ],
};

const loadFixtures = (): Fixture[] => {
  const out: Fixture[] = [];
  for (const kind of readdirSync(fixturesDir)) {
    const dir = path.join(fixturesDir, kind);
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const { component, config } = JSON.parse(
        readFileSync(path.join(dir, file), 'utf8'),
      );
      if (notInSchema[kind as FixtureKind]?.includes(component)) {
        continue;
      }
      out.push({ kind: kind as FixtureKind, component, config });
    }
  }

  return out;
};

const wrap = ({ kind, component, config }: Fixture) => {
  switch (kind) {
    case 'entity':
      return new ServerEntityBuilder({
        identifier: 'test:entity',
        components: { [component]: config },
      } as any).build();
    case 'entity_behavior':
      return new ServerEntityBuilder({
        identifier: 'test:entity',
        components: { behaviors: { [component]: config } },
      } as any).build();
    case 'item':
      return new ItemBuilder({
        identifier: 'test:item',
        components: { [component]: config },
      } as any).build();
    case 'block':
      return new BlockBuilder({
        identifier: 'test:block',
        components: { [component]: config },
      } as any).build();
  }
};

const rootKey: Record<FixtureKind, [string, string]> = {
  entity: ['minecraft:entity', 'entity'],
  entity_behavior: ['minecraft:entity', 'entity'],
  item: ['minecraft:item', 'item'],
  block: ['minecraft:block', 'block'],
};

const run = (fixture: Fixture): Result => {
  const result: Result = {
    kind: fixture.kind,
    component: fixture.component,
    outputKeys: [],
    errors: [],
  };
  try {
    const json = wrap(fixture) as any;
    const [root, schemaKind] = rootKey[fixture.kind];
    result.outputKeys = Object.keys(json[root].components ?? {});
    result.errors = validateAgainst(schemaKind as any, json).map((e) => ({
      path: e.instancePath,
      message: `${e.message ?? ''} ${JSON.stringify(e.params)}`.trim(),
    }));
    if (result.outputKeys.length === 0) {
      result.buildError = 'builder produced no components (diagnostics?)';
    }
  } catch (error) {
    result.buildError = error instanceof Error ? error.message : String(error);
  }

  return result;
};

describe.skipIf(!schemasAvailable)('bedrock schema conformance', () => {
  const results: Result[] = [];

  afterAll(() => {
    const out = process.env.SCHEMA_RESULTS;
    if (out !== undefined && out !== '') {
      mkdirSync(path.dirname(out), { recursive: true });
      writeFileSync(out, JSON.stringify(results, null, 2));
    }
  });

  for (const fixture of loadFixtures()) {
    const expectedToFail = (knownFailures[fixture.kind] ?? []).includes(
      fixture.component,
    );
    const register = expectedToFail ? it.fails : it;

    register(`${fixture.kind}/${fixture.component}`, () => {
      const result = run(fixture);
      results.push(result);

      expect(result.buildError).toBeUndefined();
      expect(result.errors).toEqual([]);
    });
  }
});

import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { createBlock } from '@ferolyte/pack/content/block/create-block';
import { BUILD_CONTEXT } from '../../build-context';
import { collectDiagnostics } from '../../check/diagnostics-collector';
import { buildContentJson } from '../content.factory';
import { buildContentSuffixRegistry } from '../utils/content-suffix-registry';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-states-'));
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
});

afterEach(() => rm(root, { recursive: true, force: true }));

const build = async (states: Record<string, any>) => {
  const collector = collectDiagnostics({ silent: true });
  const result = await buildContentJson(
    join(root, 'src', 'x.block.ts'),
    { default: createBlock({ identifier: 'ns:x', states }) },
    { debug: true, diagnostics: true },
  );
  collector.stop();
  const errors = collector.records.filter((r) => r.severity === 'error').map((r) => r.message);
  const json =
    result === undefined || result instanceof Error
      ? undefined
      : JSON.parse(await readFile(result.outFile[0], 'utf-8'));

  return { json, errors };
};

describe('block states through the compiler', () => {
  it('writes integer, boolean and string value lists', async () => {
    const { json, errors } = await build({
      'ns:level': [0, 1, 2, 3],
      'ns:lit': [false, true],
      'ns:color': ['red', 'blue'],
      'ns:power': { values: { min: 0, max: 15 } },
    });

    expect(errors).toEqual([]);
    expect(json['minecraft:block'].description.states).toEqual({
      'ns:level': [0, 1, 2, 3],
      'ns:lit': [false, true],
      'ns:color': ['red', 'blue'],
      'ns:power': { values: { min: 0, max: 15 } },
    });
  });

  it('rejects mixed value types, floats, duplicates and more than 16 values', async () => {
    expect((await build({ 'ns:a': [0, 'x'] })).errors[0]).toContain('same type');
    expect((await build({ 'ns:a': [0.5, 1] })).errors[0]).toContain('integers');
    expect((await build({ 'ns:a': [1, 1] })).errors[0]).toContain('unique');
    expect(
      (await build({ 'ns:a': Array.from({ length: 17 }, (_, i) => i) })).errors[0],
    ).toContain('at most 16');
  });
});

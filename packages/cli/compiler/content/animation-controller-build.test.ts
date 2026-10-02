import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  createAnimationController,
  defineRpState,
} from '@ferolyte/pack/animation';
import { BUILD_CONTEXT } from '../build-context';
import { buildContentJson } from './content.factory';
import { buildContentSuffixRegistry } from './utils/content-suffix-registry';

let root: string;

beforeEach(async () => {
  root = await mkdtemp(join(tmpdir(), 'ferolyte-ac-'));
  BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'BP');
  BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'RP');
  BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
  BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
});

afterEach(() => rm(root, { recursive: true, force: true }));

const controller = (name: string) =>
  createAnimationController({
    id: `controller.animation.t.${name}`,
    states: { default: defineRpState({ animations: ['idle'] }) },
  });

describe('buildContentJson with animation controllers', () => {
  it('writes several controllers of one file into a single JSON', async () => {
    const result = await buildContentJson(
      join(root, 'src', 'zombie.ac.rp.ts'),
      { default: [controller('a'), controller('b')] },
      { debug: true, diagnostics: true },
    );

    expect(result).not.toBeInstanceOf(Error);
    const outFile = (result as { outFile: string[] }).outFile;
    expect(outFile).toHaveLength(1);
    const json = JSON.parse(await readFile(outFile[0], 'utf-8'));
    expect(Object.keys(json.animation_controllers)).toEqual([
      'controller.animation.t.a',
      'controller.animation.t.b',
    ]);
    expect(outFile[0]).toContain('animation_controllers');
  });

  it('rejects an RP controller in a .ac.bp.ts file', async () => {
    const result = await buildContentJson(
      join(root, 'src', 'zombie.ac.bp.ts'),
      { default: controller('a') },
      { debug: true, diagnostics: true },
    );

    expect(result).toBeInstanceOf(Error);
  });
});

import { mkdir, mkdtemp, readFile, rm, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ClientEntityBuilder } from '@ferolyte/pack/content/client-entity/client-entity-builder';
import { schemasAvailable, validateAgainst } from '../../../pack/tests/helpers/schema';
import { BUILD_CONTEXT } from '../build-context';
import { buildClientEntityJson } from '../content/client-entity/build';
import { buildContentSuffixRegistry } from '../content/utils/content-suffix-registry';
import { clearAllContentOutputs } from '../content/utils/content-output-registry';
import { clearGraph, getDependentEntries, setEntryInputs } from '../core/graph';
import { clearAnimationIndex } from './animation-index';
import {
  patchAnimationSpeed,
  registerAnimationOption,
  unregisterAnimationOption,
} from './animation-options';

describe('speed patch', () => {
  const apply = (animation: Record<string, unknown>, speed: unknown) => {
    const result = patchAnimationSpeed(animation, speed, { animationId: 'a' });

    return { animation, result };
  };

  it('sets anim_time_update from the default', () => {
    expect(apply({}, 2).animation.anim_time_update).toBe(
      'query.anim_time + query.delta_time * (2)',
    );
  });

  it('multiplies the delta part of a default-pattern anim_time_update', () => {
    const { animation } = apply(
      { anim_time_update: 'query.anim_time + query.delta_time * 0.5' },
      'query.modified_move_speed',
    );

    expect(animation.anim_time_update).toBe(
      'query.anim_time + query.delta_time * (0.5) * (query.modified_move_speed)',
    );
  });

  it('refuses an ambiguous custom anim_time_update', () => {
    const { animation, result } = apply(
      { anim_time_update: 'math.sin(query.anim_time)' },
      2,
    );

    expect(result).toBe(false);
    expect(animation.anim_time_update).toBe('math.sin(query.anim_time)');
  });
});

describe('animation clones', () => {
  let root: string;
  const source = {
    format_version: '1.8.0',
    animations: {
      'animation.zombie.walk': {
        loop: true,
        animation_length: 1,
        bones: { leg: { rotation: [0, 0, 10] } },
      },
    },
  };

  const write = async (path: string, content: string) => {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  };

  const entity = (identifier: string, speed: unknown) =>
    new ClientEntityBuilder({
      identifier,
      animations: {
        walk: { id: 'animation.zombie.walk', speed: speed as number },
        idle: 'animation.zombie.idle',
      },
    });

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'ferolyte-anim-'));
    BUILD_CONTEXT.PACKS.INPUT_RESOURCE_PACK_PATH = join(root, 'in/RP');
    BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = join(root, 'out/RP');
    BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = join(root, 'out/BP');
    BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
    BUILD_CONTEXT.PACKS.INPUT_BASE_PATH = join(root, 'in');
    BUILD_CONTEXT.PACKS.CONTENT_SUFFIX_REGISTRY = buildContentSuffixRegistry();
    await write(
      join(root, 'in/RP/animations/zombie.animation.json'),
      `// jsonc\n${JSON.stringify(source)}`,
    );
    clearAnimationIndex();
    clearAllContentOutputs();
    clearGraph();
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it('clones per entity with different speeds and leaves the source untouched', async () => {
    const a = join(root, 'in/RP/entity/a.ce.ts');
    const b = join(root, 'in/RP/entity/b.ce.ts');
    setEntryInputs(a, []);
    const outA = await buildClientEntityJson(a, entity('t:a', 2), { debug: false, diagnostics: false });
    const outB = await buildClientEntityJson(b, entity('t:b', 'query.modified_move_speed'), {
      debug: false,
      diagnostics: false,
    });

    expect(outA).toHaveLength(2);
    expect(outB).toHaveLength(2);

    const entityA = JSON.parse(await readFile((outA as string[])[0], 'utf-8'));
    const idA = entityA['minecraft:client_entity'].description.animations.walk;
    const entityB = JSON.parse(await readFile((outB as string[])[0], 'utf-8'));
    const idB = entityB['minecraft:client_entity'].description.animations.walk;
    expect(idA).toMatch(/^animation\.zombie\.walk\.f_[0-9a-f]{8}$/);
    expect(idB).not.toBe(idA);
    expect(entityA['minecraft:client_entity'].description.animations.idle).toBe(
      'animation.zombie.idle',
    );

    const cloneFile = JSON.parse(await readFile((outA as string[])[1], 'utf-8'));
    expect(cloneFile.animations[idA].anim_time_update).toBe(
      'query.anim_time + query.delta_time * (2)',
    );
    expect(cloneFile.animations[idA].bones).toEqual(source.animations['animation.zombie.walk'].bones);

    const original = await readFile(join(root, 'in/RP/animations/zombie.animation.json'), 'utf-8');
    expect(original).not.toContain('anim_time_update');

    if (schemasAvailable) {
      expect(validateAgainst('animation', cloneFile)).toEqual([]);
    }
  });

  it('adds the source animation file to the entry dependencies', async () => {
    const a = join(root, 'in/RP/entity/a.ce.ts');
    setEntryInputs(a, []);
    await buildClientEntityJson(a, entity('t:a', 2), { debug: false, diagnostics: false });

    expect([...getDependentEntries(join(root, 'in/RP/animations/zombie.animation.json'))]).toEqual([a]);
  });

  it('applies options registered by plugins', async () => {
    registerAnimationOption('loop', (animation, value) => {
      animation.loop = value;
    });
    try {
      const a = join(root, 'in/RP/entity/a.ce.ts');
      const out = await buildClientEntityJson(
        a,
        new ClientEntityBuilder({
          identifier: 't:a',
          animations: { walk: { id: 'animation.zombie.walk', loop: 'hold_on_last_frame' } },
        }),
        { debug: false, diagnostics: false },
      );
      const cloneFile = JSON.parse(await readFile((out as string[])[1], 'utf-8'));

      expect(Object.values<any>(cloneFile.animations)[0].loop).toBe('hold_on_last_frame');
    } finally {
      unregisterAnimationOption('loop');
    }
  });
});

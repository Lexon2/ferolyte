import { describe, expect, it } from 'vitest';

import { sep } from 'path';

import { CONTENT_METADATA } from '@ferolyte/common/content/metadata';
import { BUILD_CONTEXT } from '../../build-context';
import { buildContentSuffixRegistry } from './content-suffix-registry';

const posix = (path?: string) => path?.split(sep).join('/');

describe('animation controller suffixes', () => {
  it('resolves .ac.bp.ts / .ac.rp.ts and the output paths', () => {
    BUILD_CONTEXT.PACKS.OUTPUT_BEHAVIOR_PACK_PATH = '/out/BP';
    BUILD_CONTEXT.PACKS.OUTPUT_RESOURCE_PACK_PATH = '/out/RP';
    BUILD_CONTEXT.PACKS.OUTPUT_NAMESPACE_PATH = 'ns';
    const registry = buildContentSuffixRegistry();

    expect(registry.resolveContentFile('/src/zombie.ac.bp.ts')?.metadata).toBe(
      CONTENT_METADATA.ANIMATION_CONTROLLER_BP,
    );
    expect(registry.resolveContentFile('/src/zombie.ac.rp.ts')?.metadata).toBe(
      CONTENT_METADATA.ANIMATION_CONTROLLER_RP,
    );
    expect(posix(registry.createContentOutputPath('/src/zombie.ac.bp.ts'))).toBe(
      '/out/BP/animation_controllers/ns/zombie.ac.bp.json',
    );
    expect(posix(registry.createContentOutputPath('/src/zombie.ac.rp.ts'))).toBe(
      '/out/RP/animation_controllers/ns/zombie.ac.rp.json',
    );
  });

  it('allows overriding the suffixes', () => {
    const registry = buildContentSuffixRegistry({
      'animation-controller-rp': ['ctrl'],
    });

    expect(registry.isFerolyteContentFile('/src/a.ctrl.ts')).toBe(true);
    expect(registry.isFerolyteContentFile('/src/a.ac.rp.ts')).toBe(false);
  });
});

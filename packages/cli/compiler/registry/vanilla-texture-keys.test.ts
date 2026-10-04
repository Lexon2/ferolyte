import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import {
  VANILLA_ITEM_TEXTURE_KEYS,
  VANILLA_TERRAIN_TEXTURE_KEYS,
} from './vanilla-texture-keys.generated';

const root = join(__dirname, '../../../..');
const samples = join(root, '.cache/bedrock-samples/resource_pack/textures/terrain_texture.json');

describe('vanilla texture keys (generated data)', () => {
  it('contains the well-known keys', () => {
    for (const key of ['stone', 'planks', 'stonebrick']) {
      expect(VANILLA_TERRAIN_TEXTURE_KEYS).toContain(key);
    }
    expect(VANILLA_ITEM_TEXTURE_KEYS).toContain('apple');
  });

  it.skipIf(!existsSync(samples))('matches the pinned bedrock-samples (npm run schemas:vanilla-keys)', async () => {
    // @ts-expect-error plain .mjs script without types
    const { render } = await import('../../../../scripts/schemas/vanilla-texture-keys.mjs');
    const committed = readFileSync(join(__dirname, 'vanilla-texture-keys.generated.ts'), 'utf8').replace(/\r\n/g, '\n');

    expect(committed).toBe(render());
  });
});

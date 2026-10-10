import { describe, expect, it } from 'vitest';
import { BlockBuilder } from '@ferolyte/pack/content/block/block-builder';
import { BlockConfig } from '@ferolyte/pack/content/block/interfaces/block-config';
import { minimalBlockConfig } from './helpers/fixtures';

const build = (version: BlockConfig['version'], ao: boolean | number) => {
  const config = minimalBlockConfig({
    version,
    components: {
      materialInstances: {
        '*': { texture: 'test_block', ambientOcclusion: ao },
      },
      itemVisual: {
        geometry: 'geometry.test.block',
        materialInstances: { '*': { texture: 'test_block', ambientOcclusion: ao } },
      },
    },
    permutations: [
      {
        condition: { states: { enabled: [true] } },
        components: {
          materialInstances: {
            up: { texture: 'test_block_on', ambientOcclusion: ao },
          },
        },
      },
    ],
  });
  const block = new BlockBuilder(config).build()['minecraft:block'];

  return {
    config,
    base: block.components['minecraft:material_instances']['*'].ambient_occlusion,
    itemVisual:
      block.components['minecraft:item_visual'].material_instances['*'].ambient_occlusion,
    permutation:
      block.permutations[0].components['minecraft:material_instances'].up.ambient_occlusion,
  };
};

describe('materialInstances ambientOcclusion', () => {
  it('keeps a boolean below block format 1.26.20', () => {
    expect(build('1.26.10', false)).toMatchObject({
      base: false,
      itemVisual: false,
      permutation: false,
    });
  });

  it('writes false as 0 and true as 1 from block format 1.26.20 on', () => {
    expect(build('1.26.50', false)).toMatchObject({ base: 0, itemVisual: 0, permutation: 0 });
    expect(build('1.26.20', true)).toMatchObject({ base: 1, itemVisual: 1, permutation: 1 });
  });

  it('keeps a number and does not change the config', () => {
    expect(build('1.26.50', 0.5)).toMatchObject({ base: 0.5, permutation: 0.5 });
    const { config } = build('1.26.50', false);
    expect(
      (config.components?.materialInstances as any)['*'].ambientOcclusion,
    ).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { createBlockPlacer } from '@ferolyte/pack/content/item/convertors/components/block-placer';
import { expectUndefined } from '../helpers/assert-component';

describe('createBlockPlacer', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createBlockPlacer);
  });

  it('returns undefined for empty block', () => {
    expectUndefined(createBlockPlacer, { block: '' });
  });

  it('maps required and optional fields', () => {
    expect(
      createBlockPlacer({
        block: 'test:stone',
        useOn: ['dirt'],
        replaceBlockItem: true,
        alignedPlacement: false,
      }),
    ).toEqual({
      'minecraft:block_placer': {
        block: 'test:stone',
        use_on: [{ tags: 'dirt' }],
        replace_block_item: true,
        aligned_placement: false,
      },
    });
  });
});

import { describe, it } from 'vitest';
import { createItemVisual } from '@artifex/pack/content/block/components/item-visual';
import { expectComponent, expectUndefined } from '../helpers/assert-component';
import { validItemVisual } from '../helpers/fixtures';

describe('createItemVisual', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createItemVisual);
  });

  it('returns undefined without material instances', () => {
    expectUndefined(createItemVisual, { geometry: 'geometry.test.block' });
  });

  it('maps item visual fields', () => {
    expectComponent(createItemVisual, validItemVisual, 'minecraft:item_visual', {
      geometry: 'geometry.test.block',
      material_instances: { '*': 'texture.test.block' },
    });
  });
});

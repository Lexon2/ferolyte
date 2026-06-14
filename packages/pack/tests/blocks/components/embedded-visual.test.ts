import { describe, it } from 'vitest';
import { createEmbeddedVisual } from '@artifex/pack/content/block/components/embedded-visual';
import { expectComponent, expectUndefined } from '../helpers/assert-component';
import { validItemVisual } from '../helpers/fixtures';

describe('createEmbeddedVisual', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createEmbeddedVisual);
  });

  it('returns undefined without required fields', () => {
    expectUndefined(createEmbeddedVisual, { geometry: 'geo' });
  });

  it('maps embedded visual from item visual shape', () => {
    expectComponent(createEmbeddedVisual, validItemVisual, 'minecraft:embedded_visual', {
      geometry: 'geometry.test.block',
      material_instances: { '*': 'texture.test.block' },
    });
  });
});

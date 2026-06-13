import { describe, it } from 'vitest';
import { createTransformation } from '@artifex/pack/content/block/components/transformation';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createTransformation', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createTransformation);
  });

  it('returns undefined for invalid rotation', () => {
    expectUndefined(createTransformation, { rotation: [0, 90] });
  });

  it('maps transformation fields', () => {
    expectComponent(createTransformation, {
      rotation: [0, 90, 0],
      translation: [0, 0.5, 0],
      scale: [1, 1, 1],
      scalePivot: [0, 0, 0],
      rotationPivot: [0, 0, 0],
    }, 'minecraft:transformation', {
      rotation: [0, 90, 0],
      translation: [0, 0.5, 0],
      scale: [1, 1, 1],
      scale_pivot: [0, 0, 0],
      rotation_pivot: [0, 0, 0],
    });
  });
});

import { describe, it } from 'vitest';
import { createSelectionBox } from '@artifex/pack/content/block/components/selection-box';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createSelectionBox', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createSelectionBox);
  });

  it('maps boolean value', () => {
    expectComponent(createSelectionBox, true, 'minecraft:selection_box', true);
  });

  it('returns undefined for invalid size', () => {
    expectUndefined(createSelectionBox, { size: [1, 1] });
  });

  it('maps object with origin and size', () => {
    expectComponent(createSelectionBox, {
      origin: [-8, 0, -8],
      size: [16, 16, 16],
    }, 'minecraft:selection_box', {
      origin: [-8, 0, -8],
      size: [16, 16, 16],
    });
  });
});

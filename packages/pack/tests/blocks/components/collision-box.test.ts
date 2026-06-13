import { describe, expect, it } from 'vitest';
import { createCollisionBox } from '@artifex/pack/content/block/components/collision-box';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createCollisionBox', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createCollisionBox);
  });

  it('returns undefined for invalid origin', () => {
    expectUndefined(createCollisionBox, { origin: [0, 0] });
  });

  it('maps boolean value', () => {
    expectComponent(createCollisionBox, true, 'minecraft:collision_box', true);
  });

  it('maps object with origin and size', () => {
    expect(createCollisionBox({
      origin: [-8, 0, -8],
      size: [16, 16, 16],
    })).toEqual({
      'minecraft:collision_box': {
        origin: [-8, 0, -8],
        size: [16, 16, 16],
      },
    });
  });

  it('maps array of boxes', () => {
    expect(createCollisionBox([
      { origin: [0, 0, 0], size: [8, 8, 8] },
      { origin: [8, 0, 0], size: [8, 8, 8] },
    ])).toEqual({
      'minecraft:collision_box': [
        { origin: [0, 0, 0], size: [8, 8, 8] },
        { origin: [8, 0, 0], size: [8, 8, 8] },
      ],
    });
  });
});

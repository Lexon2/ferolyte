import { describe, expect, it } from 'vitest';
import { convertBlockTraits } from '@artifex/pack/content/block/traits/convert-traits';

describe('convertBlockTraits', () => {
  it('returns undefined when input is missing', () => {
    expect(convertBlockTraits(undefined as never)).toBeUndefined();
  });

  it('maps placement direction and position traits', () => {
    expect(convertBlockTraits({
      placementDirection: {
        states: ['minecraft:cardinal_direction'],
        yRotation: 90,
      },
      placementPosition: {
        states: ['minecraft:block_face'],
      },
    })).toEqual({
      'minecraft:placement_direction': {
        enabled_states: ['minecraft:cardinal_direction'],
        y_rotation_offset: 90,
      },
      'minecraft:placement_position': {
        enabled_states: ['minecraft:block_face'],
      },
    });
  });

  it('omits invalid yRotation but keeps valid states', () => {
    expect(convertBlockTraits({
      placementDirection: {
        states: ['minecraft:facing_direction'],
        yRotation: 45 as never,
      },
    })).toEqual({
      'minecraft:placement_direction': {
        enabled_states: ['minecraft:facing_direction'],
        y_rotation_offset: undefined,
      },
    });
  });

  it('skips traits with invalid states', () => {
    expect(convertBlockTraits({
      placementDirection: { states: ['invalid' as never] },
    })).toEqual({});
  });
});

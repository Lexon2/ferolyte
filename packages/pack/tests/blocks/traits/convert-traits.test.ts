import { describe, expect, it, vi } from 'vitest';
import { convertBlockTraits } from '@ferolyte/pack/content/block/traits/convert-traits';

describe('convertBlockTraits', () => {
  it('returns undefined when input is missing', () => {
    expect(convertBlockTraits(undefined as never)).toBeUndefined();
  });

  it('maps placement direction and position traits', () => {
    expect(
      convertBlockTraits({
        placementDirection: {
          states: ['minecraft:cardinal_direction'],
          yRotation: 90,
        },
        placementPosition: {
          states: ['minecraft:block_face'],
        },
      }),
    ).toEqual({
      'minecraft:placement_direction': {
        enabled_states: ['minecraft:cardinal_direction'],
        y_rotation_offset: 90,
      },
      'minecraft:placement_position': {
        enabled_states: ['minecraft:block_face'],
      },
    });
  });

  it('keeps an invalid yRotation and reports it', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(
      convertBlockTraits({
        placementDirection: {
          states: ['minecraft:facing_direction'],
          yRotation: 45 as never,
        },
      }),
    ).toEqual({
      'minecraft:placement_direction': {
        enabled_states: ['minecraft:facing_direction'],
        y_rotation_offset: 45,
      },
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });

  it('keeps invalid states and reports them', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(
      convertBlockTraits({
        placementDirection: { states: ['invalid' as never] },
      }),
    ).toEqual({
      'minecraft:placement_direction': { enabled_states: ['invalid'] },
    });
    expect(error).toHaveBeenCalled();
    error.mockRestore();
  });
});

import { describe, expect, it, vi } from 'vitest';
import { convertBlockComponents } from '@ferolyte/pack/content/block/convert-components';

describe('convertBlockComponents', () => {
  it('returns undefined for empty components', () => {
    expect(convertBlockComponents({})).toBeUndefined();
  });

  it('merges multiple registered components', () => {
    expect(
      convertBlockComponents({
        friction: 0.6,
        lightEmission: 7,
      }),
    ).toEqual({
      'minecraft:friction': 0.6,
      'minecraft:light_emission': 7,
    });
  });

  it('passes through unknown components', () => {
    expect(
      convertBlockComponents({
        'test:custom_component': { value: 1 },
      }),
    ).toEqual({
      'test:custom_component': { value: 1 },
    });
  });

  it('keeps invalid values of known components and reports them', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(
      convertBlockComponents({
        collisionBox: { origin: 'x' as never },
        replaceable: true,
      }),
    ).toEqual({
      'minecraft:collision_box': { origin: 'x' },
      'minecraft:replaceable': {},
    });

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

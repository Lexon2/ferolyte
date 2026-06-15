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

  it('skips invalid registered components', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(
      convertBlockComponents({
        loot: '',
        replaceable: true,
      }),
    ).toEqual({
      'minecraft:replaceable': {},
    });

    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

import { describe, it } from 'vitest';
import { createMapColor } from '@artifex/pack/content/block/components/map-color';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createMapColor', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createMapColor);
  });

  it('returns undefined for invalid rgb array', () => {
    expectUndefined(createMapColor, [255, 0]);
  });

  it('maps hex color', () => {
    expectComponent(createMapColor, '#ff0000', 'minecraft:map_color', '#ff0000');
  });

  it('maps color object with tint method', () => {
    expectComponent(createMapColor, { color: '#00ff00', tintMethod: 'noise' }, 'minecraft:map_color', {
      color: '#00ff00',
      tint_method: 'noise',
    });
  });
});

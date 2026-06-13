import { describe, it } from 'vitest';
import { createHoverTextColor } from '@artifex/pack/content/item/convertors/components/hover-text-color';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createHoverTextColor', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createHoverTextColor);
  });

  it('returns undefined for invalid color', () => {
    expectUndefined(createHoverTextColor, 'invalid');
  });

  it('maps valid color', () => {
    expectComponent(createHoverTextColor, 'red', 'minecraft:hover_text_color', 'red');
  });
});

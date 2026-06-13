import { describe, it } from 'vitest';
import { createIcon } from '@artifex/pack/content/item/convertors/components/icon';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createIcon', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createIcon);
  });

  it('returns undefined for empty string', () => {
    expectUndefined(createIcon, '');
  });

  it('maps string icon', () => {
    expectComponent(createIcon, 'textures/items/stone.png', 'minecraft:icon', {
      textures: { default: 'textures/items/stone.png' },
    });
  });

  it('maps textures object', () => {
    expectComponent(createIcon, {
      textures: { default: 'textures/items/stone.png', damaged: 'textures/items/stone_damaged.png' },
    }, 'minecraft:icon', {
      textures: { default: 'textures/items/stone.png', damaged: 'textures/items/stone_damaged.png' },
    });
  });
});

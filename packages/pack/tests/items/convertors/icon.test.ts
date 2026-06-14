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

  it('maps string icon texture key', () => {
    expectComponent(createIcon, 'artifex:test', 'minecraft:icon', {
      textures: { default: 'artifex:test' },
    });
  });

  it('maps textures object with atlas keys', () => {
    expectComponent(createIcon, {
      textures: { default: 'artifex:test', damaged: 'artifex:test_damaged' },
    }, 'minecraft:icon', {
      textures: { default: 'artifex:test', damaged: 'artifex:test_damaged' },
    });
  });
});

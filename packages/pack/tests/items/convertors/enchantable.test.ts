import { describe, it } from 'vitest';
import { createEnchantable } from '@artifex/pack/content/item/convertors/components/enchantable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createEnchantable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createEnchantable);
  });

  it('returns undefined for invalid slot', () => {
    expectUndefined(createEnchantable, { slot: 'invalid' });
  });

  it('maps valid enchantable', () => {
    expectComponent(createEnchantable, { slot: 'sword', value: 10 }, 'minecraft:enchantable', {
      slot: 'sword',
      value: 10,
    });
  });
});

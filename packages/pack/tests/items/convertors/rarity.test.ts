import { describe, it } from 'vitest';
import { createRarity } from '@artifex/pack/content/item/convertors/components/rarity';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createRarity', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createRarity);
  });

  it('returns undefined for invalid rarity', () => {
    expectUndefined(createRarity, 'legendary');
  });

  it('maps valid rarity', () => {
    expectComponent(createRarity, 'rare', 'minecraft:rarity', 'rare');
  });
});

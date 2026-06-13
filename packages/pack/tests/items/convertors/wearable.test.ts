import { describe, it } from 'vitest';
import { createWearable } from '@artifex/pack/content/item/convertors/components/wearable';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createWearable', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createWearable);
  });

  it('returns undefined for invalid slot', () => {
    expectUndefined(createWearable, { slot: 'invalid' });
  });

  it('maps wearable fields', () => {
    expectComponent(createWearable, {
      slot: 'slot.armor.head',
      protection: 2,
      dispensable: true,
      hidesPlayerLocation: false,
    }, 'minecraft:wearable', {
      slot: 'slot.armor.head',
      protection: 2,
      dispensable: true,
      hides_player_location: false,
    });
  });
});

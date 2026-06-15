import { describe, expect, it } from 'vitest';
import { createPiercingWeapon } from '@ferolyte/pack/content/item/convertors/components/piercing-weapon';
import { expectUndefined } from '../helpers/assert-component';

describe('createPiercingWeapon', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createPiercingWeapon);
  });

  it('returns undefined for invalid hitboxMargin', () => {
    expectUndefined(createPiercingWeapon, { hitboxMargin: 'large' });
  });

  it('maps piercing weapon fields', () => {
    expect(
      createPiercingWeapon({
        reach: { min: 1, max: 5 },
        creativeReach: { min: 2, max: 6 },
        hitboxMargin: 0.1,
      }),
    ).toEqual({
      'minecraft:piercing_weapon': {
        reach: { min: 1, max: 5 },
        creative_reach: { min: 2, max: 6 },
        hitbox_margin: 0.1,
      },
    });
  });
});

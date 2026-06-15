import { describe, expect, it } from 'vitest';
import { createAllowOffHand } from '@ferolyte/pack/content/item/convertors/components/allow-off-hand';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createAllowOffHand', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createAllowOffHand);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createAllowOffHand, 'invalid');
  });

  it('maps valid boolean to minecraft:allow_off_hand', () => {
    expectComponent(createAllowOffHand, true, 'minecraft:allow_off_hand', true);
    expectComponent(
      createAllowOffHand,
      false,
      'minecraft:allow_off_hand',
      false,
    );
  });
});

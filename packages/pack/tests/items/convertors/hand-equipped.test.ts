import { describe, expect, it } from 'vitest';
import { createHandEquipped } from '@ferolyte/pack/content/item/convertors/components/hand-equipped';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createHandEquipped', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createHandEquipped);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createHandEquipped, 'invalid');
  });

  it('maps valid boolean to minecraft:hand_equipped', () => {
    expectComponent(createHandEquipped, true, 'minecraft:hand_equipped', true);
    expectComponent(
      createHandEquipped,
      false,
      'minecraft:hand_equipped',
      false,
    );
  });
});

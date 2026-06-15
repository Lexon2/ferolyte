import { describe, expect, it } from 'vitest';
import { createCanDestroyInCreative } from '@ferolyte/pack/content/item/convertors/components/can-destroy-in-creative';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createCanDestroyInCreative', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createCanDestroyInCreative);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createCanDestroyInCreative, 'invalid');
  });

  it('maps valid boolean to minecraft:can_destroy_in_creative', () => {
    expectComponent(
      createCanDestroyInCreative,
      true,
      'minecraft:can_destroy_in_creative',
      true,
    );
    expectComponent(
      createCanDestroyInCreative,
      false,
      'minecraft:can_destroy_in_creative',
      false,
    );
  });
});

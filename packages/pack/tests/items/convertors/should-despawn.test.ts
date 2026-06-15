import { describe, expect, it } from 'vitest';
import { createShouldDespawn } from '@ferolyte/pack/content/item/convertors/components/should-despawn';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createShouldDespawn', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createShouldDespawn);
  });

  it('returns undefined for invalid type', () => {
    expectUndefined(createShouldDespawn, 'invalid');
  });

  it('maps valid boolean to minecraft:should_despawn', () => {
    expectComponent(
      createShouldDespawn,
      true,
      'minecraft:should_despawn',
      true,
    );
    expectComponent(
      createShouldDespawn,
      false,
      'minecraft:should_despawn',
      false,
    );
  });
});

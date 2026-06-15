import { describe, it } from 'vitest';
import { createFuel } from '@ferolyte/pack/content/item/convertors/components/fuel';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createFuel', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createFuel);
  });

  it('returns undefined for non-positive duration', () => {
    expectUndefined(createFuel, { duration: 0 });
  });

  it('maps fuel duration', () => {
    expectComponent(createFuel, { duration: 100 }, 'minecraft:fuel', {
      duration: 100,
    });
  });
});

import { describe, it } from 'vitest';
import { createChestObstruction } from '@ferolyte/pack/content/block/components/chest-obstruction';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createChestObstruction', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createChestObstruction);
  });

  it('returns undefined for invalid obstruction rule', () => {
    expectUndefined(createChestObstruction, { obstructionRule: 'invalid' });
  });

  it('maps valid obstruction rule', () => {
    expectComponent(
      createChestObstruction,
      { obstructionRule: 'always' },
      'minecraft:chest_obstruction',
      {
        obstruction_rule: 'always',
      },
    );
  });
});

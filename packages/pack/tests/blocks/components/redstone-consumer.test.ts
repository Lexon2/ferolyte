import { describe, it } from 'vitest';
import { createRedstoneConsumer } from '@artifex/pack/content/block/components/redstone-consumer';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createRedstoneConsumer', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createRedstoneConsumer);
  });

  it('returns undefined for invalid minPower', () => {
    expectUndefined(createRedstoneConsumer, { minPower: 20 });
  });

  it('maps redstone consumer fields', () => {
    expectComponent(createRedstoneConsumer, { minPower: 1, propagatesPower: true }, 'minecraft:redstone_consumer', {
      min_power: 1,
      propagates_power: true,
    });
  });
});

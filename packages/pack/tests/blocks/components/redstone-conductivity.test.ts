import { describe, it } from 'vitest';
import { createRedstoneConductivity } from '@artifex/pack/content/block/components/redstone-conductivity';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createRedstoneConductivity', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createRedstoneConductivity);
  });

  it('returns undefined for invalid boolean field', () => {
    expectUndefined(createRedstoneConductivity, { redstoneConductor: 'yes' });
  });

  it('maps redstone conductivity fields', () => {
    expectComponent(createRedstoneConductivity, {
      allowsWireToStepDown: true,
      redstoneConductor: true,
    }, 'minecraft:redstone_conductivity', {
      allows_wire_to_step_down: true,
      redstone_conductor: true,
    });
  });
});

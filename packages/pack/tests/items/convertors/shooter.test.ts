import { describe, expect, it } from 'vitest';
import { createShooter } from '@ferolyte/pack/content/item/convertors/components/shooter';
import { expectUndefined } from '../helpers/assert-component';

describe('createShooter', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createShooter);
  });

  it('returns undefined for invalid chargeOnDraw', () => {
    expectUndefined(createShooter, { chargeOnDraw: 'yes' });
  });

  it('maps shooter fields', () => {
    expect(
      createShooter({
        ammunition: [{ item: 'minecraft:arrow', useOffhand: true }],
        chargeOnDraw: true,
        maxDrawDuration: 1,
        scalePowerByDrawDuration: true,
      }),
    ).toEqual({
      'minecraft:shooter': {
        ammunition: [{ item: 'minecraft:arrow', use_offhand: true }],
        charge_on_draw: true,
        max_draw_duration: 1,
        scale_power_by_draw_duration: true,
      },
    });
  });

  it('returns undefined for invalid ammunition item', () => {
    expectUndefined(createShooter, {
      ammunition: [{ item: '' }],
    });
  });
});

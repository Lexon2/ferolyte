import { describe, it } from 'vitest';
import { createProjectile } from '@ferolyte/pack/content/item/convertors/components/projectile';
import { expectComponent, expectUndefined } from '../helpers/assert-component';

describe('createProjectile', () => {
  it('returns undefined when input is missing', () => {
    expectUndefined(createProjectile);
  });

  it('returns undefined for empty projectileEntity', () => {
    expectUndefined(createProjectile, { projectileEntity: '' });
  });

  it('maps projectile fields', () => {
    expectComponent(
      createProjectile,
      {
        projectileEntity: 'minecraft:arrow',
        minimumCriticalPower: 1.25,
      },
      'minecraft:projectile',
      {
        projectile_entity: 'minecraft:arrow',
        minimum_critical_power: 1.25,
      },
    );
  });
});

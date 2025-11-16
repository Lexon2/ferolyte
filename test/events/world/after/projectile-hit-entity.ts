import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.projectileHitEntity(
  ({ entity, projectile }) => {
    console.warn(
      `Projectile ${projectile.typeId} hit entity ${entity?.typeId}.`,
    );
  },
  {
    entityTypeId: ['minecraft:cow'],
    projectileTypeId: ['minecraft:arrow'],
  },
);

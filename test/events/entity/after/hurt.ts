import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.hurt(
  ({ hurtEntity, damage, damageSource }) => {
    console.warn(
      `Entity ${hurtEntity.typeId} took ${damage} damage due to ${damageSource}.`,
    );
  },
  {
    entityTypeId: ['minecraft:pig'],
  },
);

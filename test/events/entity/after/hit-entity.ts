import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.hitEntity(
  ({ damagingEntity, hitEntity }) => {
    console.warn(
      `Entity ${damagingEntity.typeId} hit entity ${hitEntity.typeId}.`,
    );
  },
  {
    damagerTypeId: ['minecraft:player'],
    entityTypeId: ['minecraft:pig'],
  },
);

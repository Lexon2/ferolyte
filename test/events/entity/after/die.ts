import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.die(
  ({ deadEntity }) => {
    console.warn(`Entity ${deadEntity.typeId} has died.`);
  },
  {
    entityTypeId: ['minecraft:cow'],
  },
);

import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.remove(
  ({ typeId }) => {
    console.warn(`Entity ${typeId} has been removed.`);
  },
  {
    entityTypeId: ['minecraft:creeper'],
  },
);

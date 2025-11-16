import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.entityLoad(
  ({ entity }) => {
    console.warn(`Entity ${entity.typeId} has been loaded.`);
  },
  {
    entityTypeId: ['minecraft:cow'],
  },
);

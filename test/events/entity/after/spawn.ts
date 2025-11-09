import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.spawn(
  ({ entity }) => {
    console.warn(`Entity ${entity.typeId} has spawned.`);
  },
  {
    entityTypeId: ['minecraft:chicken', 'minecraft:cow'],
  },
);

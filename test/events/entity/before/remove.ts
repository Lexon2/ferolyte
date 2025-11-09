import * as EntityBeforeEvents from '@artifex/events/entity/before';

EntityBeforeEvents.remove(
  (context) => {
    const { removedEntity } = context;

    console.warn(`Entity ${removedEntity.typeId} is about to be removed.`);
  },
  {
    entityTypeId: ['minecraft:zombie', 'minecraft:skeleton'],
  },
);

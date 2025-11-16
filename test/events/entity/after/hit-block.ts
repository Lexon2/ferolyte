import * as EntityAfterEvents from '@artifex/events/entity/after';

EntityAfterEvents.hitBlock(
  ({ entity, block }) => {
    console.warn(`Entity ${entity.typeId} hit block ${block.typeId}.`);
  },
  // {
  //   entityTypeId: ['minecraft:arrow', 'minecraft:fireball'],
  // },
);

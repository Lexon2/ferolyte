import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.itemUse(
  ({ player, itemStack }) => {
    console.warn(`Player ${player.name} used ${itemStack?.typeId}`);
  },
  {
    itemTypeId: ['minecraft:apple'],
  },
);

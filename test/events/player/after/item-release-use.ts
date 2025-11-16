import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.itemReleaseUse(
  ({ player, itemStack }) => {
    console.warn(`Player ${player.name} released ${itemStack?.typeId}`);
  },
  {
    itemTypeId: ['minecraft:bow'],
  },
);

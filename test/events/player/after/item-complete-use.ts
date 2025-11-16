import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.itemCompleteUse(
  ({ player, itemStack, useDuration }) => {
    console.warn(
      `Player ${player.name} completed using ${itemStack?.typeId} after ${useDuration} ticks.`,
    );
  },
  {
    itemTypeId: ['minecraft:apple'],
  },
);

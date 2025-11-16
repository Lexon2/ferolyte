import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.itemStopUse(
  ({ player, itemStack, useDuration }) => {
    console.warn(
      `Player ${player.name} stopped using ${itemStack?.typeId} after ${useDuration} ticks.`,
    );
  },
  {
    itemTypeId: ['minecraft:trident'],
  },
);

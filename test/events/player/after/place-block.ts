import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.placeBlock(
  ({ block, player }) => {
    console.warn(`Player ${player.name} placed block ${block.typeId}`);
  },
  {
    blockTypeId: ['minecraft:stone'],
  },
);

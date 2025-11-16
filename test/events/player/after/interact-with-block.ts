import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.interactWithBlock(
  ({ block, player }) => {
    console.warn(`Player ${player.name} interacted with block ${block.typeId}`);
  },
  {
    blockTypeId: ['minecraft:chest'],
  },
);

import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.breakBlock(
  ({ block, player }) => {
    console.warn(`Player ${player.name} broke block ${block.typeId}`);
  },
  {
    brokenBlockTypeId: ['minecraft:stone'],
    itemTypeId: ['minecraft:stone_pickaxe'],
  },
);

import * as PlayerBeforeEvents from '@artifex/events/player/before';

PlayerBeforeEvents.interactWithBlock(
  (ctx) => {
    const { player, block, itemStack } = ctx;
    console.warn(
      `Player ${player.name} is interacting with block ${block.typeId} using ${itemStack?.typeId}`,
    );
    if (block.typeId === 'minecraft:chest') {
      ctx.cancel = true;
      console.warn(`Interacting with chests is not allowed!`);
    }
  },
  {
    blockTypeId: ['minecraft:chest'],
    itemTypeId: ['minecraft:stick'],
  },
);

import * as PlayerBeforeEvents from '@artifex/events/player/before';

PlayerBeforeEvents.breakBlock(
  (ctx) => {
    const { player, block } = ctx;
    console.warn(`Player ${player.name} is breaking block ${block.typeId}`);
    if (block.typeId === 'minecraft:diamond_block') {
      ctx.cancel = true;
      console.warn(`Breaking diamond blocks is not allowed!`);
    }
  },
  {
    blockTypeId: ['minecraft:diamond_block', 'minecraft:stone'],
  },
);

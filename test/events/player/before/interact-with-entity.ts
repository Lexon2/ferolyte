import * as PlayerBeforeEvents from '@artifex/events/player/before';

PlayerBeforeEvents.interactWithEntity(
  (ctx) => {
    const { player, itemStack, entity } = ctx;
    console.warn(
      `Player ${player.name} is interacting with entity ${entity.typeId} using ${itemStack?.typeId}`,
    );
    if (entity.typeId === 'minecraft:cow') {
      ctx.cancel = true;
    }
  },
  {
    entityTypeId: ['minecraft:cow'],
    itemTypeId: ['minecraft:wheat'],
  },
);

import * as PlayerAfterEvents from '@artifex/events/player/after';

PlayerAfterEvents.interactWithEntity(
  ({ entity, player }) => {
    console.warn(
      `Player ${player.name} interacted with entity ${entity.typeId}`,
    );
  },
  {
    entityTypeId: ['minecraft:cow'],
  },
);

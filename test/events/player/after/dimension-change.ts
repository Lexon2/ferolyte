import * as PlayerAfterEvents from '@artifex/events/player/after';
import { MinecraftDimensionTypes } from '@minecraft/vanilla-data';

PlayerAfterEvents.dimensionChange(
  ({ player, fromDimension, toDimension }) => {
    console.warn(
      `Player ${player.name} moved from ${fromDimension.id} to ${toDimension.id}`,
    );
  },
  {
    fromDimensionId: [MinecraftDimensionTypes.Overworld],
    toDimensionId: [MinecraftDimensionTypes.Nether],
  },
);

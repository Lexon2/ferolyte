import * as EntityBeforeEvents from '@artifex/events/entity/before';
import { MinecraftEffectTypes } from '@minecraft/vanilla-data';

EntityBeforeEvents.effectAdd(
  (context) => {
    const { entity, effectType, duration } = context;

    console.warn(
      `Entity ${entity.typeId} is about to receive effect ${effectType} for ${duration} ticks.`,
    );

    if (effectType === MinecraftEffectTypes.Poison) {
      context.cancel = true; // Cancel the effect if it's poison
      console.warn(
        `Effect ${effectType} has been canceled for ${entity.typeId}.`,
      );
    }
  },
  {
    entityTypeId: ['minecraft:player'],
  },
);

import * as EntityAfterEvents from '@artifex/events/entity/after';
import { MinecraftEffectTypes } from '@minecraft/vanilla-data';

EntityAfterEvents.addEffect(
  ({ entity, effect }) => {
    console.warn(
      `Entity ${entity.typeId} received effect ${effect.typeId} for ${effect.duration} ticks.`,
    );
  },
  {
    entityTypeId: ['minecraft:player'],
    effectTypeId: [MinecraftEffectTypes.Speed],
  },
);

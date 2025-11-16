import { Dimension, world } from '@minecraft/server';

import { worldLoad } from '@artifex/events/world/after';

let overworld: Dimension | undefined;
let nether: Dimension | undefined;
let theEnd: Dimension | undefined;

export class MinecraftDimensions {
  static get overworld(): Dimension {
    if (!overworld) {
      // TODO: Add a better error handling
      throw new Error('Overworld dimension not found');
    }
    return overworld;
  }

  static get nether(): Dimension {
    if (!nether) {
      // TODO: Add a better error handling
      throw new Error('Nether dimension not found');
    }
    return nether;
  }

  static get theEnd(): Dimension {
    if (!theEnd) {
      // TODO: Add a better error handling
      throw new Error('The End dimension not found');
    }
    return theEnd;
  }
}

worldLoad(() => {
  overworld = world.getDimension('minecraft:overworld');
  nether = world.getDimension('minecraft:nether');
  theEnd = world.getDimension('minecraft:the_end');
});

import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.blockExplode(({ explodedBlockPermutation }) => {
  console.warn(`Block ${explodedBlockPermutation.type.id} exploded.`);
});

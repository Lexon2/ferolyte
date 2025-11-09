import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.targetBlockHit(({ block }) => {
  console.warn(`Target block ${block.typeId} was hit.`);
});

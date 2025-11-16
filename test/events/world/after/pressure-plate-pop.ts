import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.pressurePlatePop(({ block }) => {
  console.warn(`Pressure plate ${block.typeId} popped.`);
});

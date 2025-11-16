import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.pressurePlatePush(({ block }) => {
  console.warn(`Pressure plate ${block.typeId} was pushed.`);
});

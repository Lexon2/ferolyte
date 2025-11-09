import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.tripWireTrip(({ block }) => {
  console.warn(`Trip wire ${block.typeId} was tripped.`);
});

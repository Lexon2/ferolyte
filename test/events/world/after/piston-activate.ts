import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.pistonActivate(({ piston }) => {
  console.warn(`Piston at ${piston.block.location} was activated.`);
});

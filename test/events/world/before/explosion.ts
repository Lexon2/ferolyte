import * as WorldAfterEvents from '@artifex/events/world/after';

WorldBeforeEvents.explosion((context) => {
  console.warn(`Explosion is about to occur at ${context.source}.`);

  // Cancel the explosion if it is too large
  if (context.getImpactedBlocks().length > 10) {
    context.cancel = true;
    console.warn(`Explosion canceled due to excessive radius: > 10.`);
  }
});

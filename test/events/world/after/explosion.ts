import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.explosion(() => {
  console.warn(`An explosion occurred.`);
});

import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.gameRuleChange(({ rule, value }) => {
  console.warn(`Game rule ${rule} changed to ${value}.`);
});

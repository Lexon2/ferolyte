import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.weatherChange(({ dimension, newWeather }) => {
  console.warn(`Weather changed to ${newWeather} in dimension ${dimension}.`);
});

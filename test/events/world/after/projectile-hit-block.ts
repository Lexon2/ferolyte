import * as WorldAfterEvents from '@artifex/events/world/after';

WorldAfterEvents.projectileHitBlock(({ block, projectile }) => {
  console.warn(`Projectile ${projectile.typeId} hit block ${block.typeId}.`);
});

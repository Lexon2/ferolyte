// import './events';

// import './utils';

import { system, TicksPerSecond, world } from '@minecraft/server';

import { entityEventTrigger } from '@artifex/events/entity/after/data-driven-trigger-event';
import { entitySpawn } from '@artifex/events/entity/after';
import { scriptEvent } from '@artifex/events/system/after';

import './block';
import './item';
import './branchless/main';

function init() {
  const iter = 1000;
  for (let i = 0; i < iter; i++) {
    // world.afterEvents.entitySpawn.subscribe(() => {});

    entitySpawn(() => {}, {
      entityTypeId: ['artifex:cow'],
    });
  }
}

init();

scriptEvent(
  async ({ player }) => {
    const { dimension, location } = player;
    const entity = dimension.spawnEntity('artifex:cow', location);
    entity.triggerEvent(`artifex:test_10000`);

    await system.waitTicks(TicksPerSecond * 2);

    entity.remove();
  },
  {
    source: 'player',
    id: 'artifex:test',
    message: 'event',
  },
);

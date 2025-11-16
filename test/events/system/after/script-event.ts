import { ScriptEventSource, world } from '@minecraft/server';

import * as SystemAfterEvents from '@artifex/events/system/after';

SystemAfterEvents.scriptEvent(
  ({ message, player }) => {
    console.warn(
      `Player ${player.name} triggered script event with message: ${message}`,
    );
  },
  {
    id: 'artifex:event',
    source: 'player',
  },
);

SystemAfterEvents.scriptEvent(
  ({ message, entity }) => {
    console.warn(
      `Entity ${entity.typeId} triggered script event with message: ${message}`,
    );
  },
  {
    id: 'artifex:event',
    entityTypeId: 'minecraft:cow',
    source: ScriptEventSource.Entity,
  },
);

SystemAfterEvents.scriptEvent(
  ({ message, block }) => {
    console.warn(
      `Block ${block.typeId} triggered script event with message: ${message}`,
    );
  },
  {
    id: 'artifex:event',
    source: ScriptEventSource.Block,
    blockTypeId: 'minecraft:stone',
  },
);

const test = () => {
  const command = 'scriptevent artifex:event test message';
  world.getDimension('overworld').runCommand(command);
};
SystemAfterEvents.scriptEvent(
  ({ message }) => {
    console.warn(`Server triggered script event with message: ${message}`);
  },
  {
    id: 'artifex:event',
    source: ScriptEventSource.Server,
  },
);

test();
